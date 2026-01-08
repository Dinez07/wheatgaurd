import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, AlertCircle, CheckCircle, Image as ImageIcon, X, Sparkles } from "lucide-react";

interface DetectionResult {
  diseaseName: string;
  severity: "Low" | "Medium" | "High";
  confidence: number;
  treatment: string;
  prevention: string;
}

const diseaseDatabase: DetectionResult[] = [
  {
    diseaseName: "Leaf Rust",
    severity: "Medium",
    confidence: 92.5,
    treatment: "Apply fungicides containing propiconazole or tebuconazole. Remove infected leaves immediately.",
    prevention: "Use resistant wheat varieties. Ensure proper spacing for air circulation. Avoid excessive nitrogen fertilization.",
  },
  {
    diseaseName: "Stem Rust",
    severity: "High",
    confidence: 88.3,
    treatment: "Apply triazole-based fungicides immediately. Remove and destroy infected plants to prevent spread.",
    prevention: "Plant resistant varieties. Monitor fields regularly during warm, humid weather. Implement crop rotation.",
  },
  {
    diseaseName: "Powdery Mildew",
    severity: "Low",
    confidence: 94.7,
    treatment: "Apply sulfur-based fungicides or systemic fungicides like triadimefon. Improve air circulation.",
    prevention: "Avoid excessive nitrogen fertilization. Ensure proper plant spacing. Use resistant wheat varieties.",
  },
  {
    diseaseName: "Septoria Leaf Blotch",
    severity: "Medium",
    confidence: 89.1,
    treatment: "Apply fungicides containing azoxystrobin or propiconazole at early symptoms. Remove crop debris.",
    prevention: "Use certified disease-free seeds. Practice crop rotation. Avoid overhead irrigation.",
  },
];

const rgbToHsv = (r: number, g: number, b: number) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / d) % 6;
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : d / max;
  const v = max;
  return { h, s, v };
};

const validateWheatLeafPhoto = async (file: File) => {
  // NOTE: This is a lightweight demo heuristic (not real AI).
  // It tries to reject obvious non-leaf photos (sky/people/objects) so we only show disease results for leaf-like images.
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return { ok: true as const };
  }

  let width = 96;
  let height = 96;

  try {
    // Downscale at decode time for speed
    const bitmap = await createImageBitmap(file, {
      resizeWidth: width,
      resizeHeight: height,
      resizeQuality: "low",
    } as any);

    width = bitmap.width;
    height = bitmap.height;
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
  } catch {
    // If createImageBitmap fails, we allow analysis rather than hard-blocking.
    return { ok: true as const };
  }

  const { data } = ctx.getImageData(0, 0, width, height);

  let considered = 0;
  let leafLike = 0;
  let greenDominant = 0;
  let blueLike = 0;
  let neutralLike = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    const a = data[i + 3] / 255;

    if (a < 0.8) continue;

    const { h, s, v } = rgbToHsv(r, g, b);

    // ignore near-black / near-white pixels (background)
    const isVeryDark = v < 0.08;
    const isNearWhite = v > 0.92 && s < 0.12;
    if (isVeryDark) continue;

    considered += 1;

    if (isNearWhite) neutralLike += 1;

    const isLeafHue = h >= 15 && h <= 165; // yellow→green range
    const isRustHue = h <= 40 || h >= 340; // orange/red range
    const isBlueHue = h >= 190 && h <= 260; // sky-ish blues

    if (isBlueHue && s > 0.18 && v > 0.2) blueLike += 1;

    // Strong green dominance is a good hint for leaf close-ups
    const isGreenDominant = g > r * 1.08 && g > b * 1.08 && s > 0.12 && v > 0.12;
    if (isGreenDominant) greenDominant += 1;

    // Accept both healthy-leaf greens/yellows and rust/orange patches, but require some saturation.
    if ((isLeafHue && s > 0.14 && v > 0.12) || (isRustHue && s > 0.22 && v > 0.12)) {
      leafLike += 1;
    }
  }

  if (considered < 400) {
    return {
      ok: false as const,
      message: "Image is too unclear. Please upload a sharp, close-up wheat leaf photo.",
    };
  }

  const leafScore = leafLike / considered;
  const greenScore = greenDominant / considered;
  const blueScore = blueLike / considered;
  const neutralScore = neutralLike / considered;

  // Heuristic thresholds (tuned to reject obvious non-wheat / non-leaf photos).
  const ok = (leafScore >= 0.42 || greenScore >= 0.26) && blueScore <= 0.25 && neutralScore <= 0.7;

  if (!ok) {
    return {
      ok: false as const,
      message:
        "This doesn't look like a close-up wheat leaf photo. Please upload a clear wheat leaf image (close-up), not a field/sky/people/object photo.",
    };
  }

  return { ok: true as const };
};

export const DetectionSection = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      processImage(file);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  }, []);

  const processImage = (file: File) => {
    setUploadedFile(file);
    setValidationError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setResult(null);
      setScanProgress(0);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!uploadedFile) return;

    // Gate the demo results to leaf-like images only.
    const validation = await validateWheatLeafPhoto(uploadedFile);
    if (!validation.ok) {
      setResult(null);
      setIsAnalyzing(false);
      setScanProgress(0);
      setValidationError(validation.message);
      return;
    }

    setValidationError(null);
    setIsAnalyzing(true);
    setScanProgress(0);

    // Simulate AI analysis with progress
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2500));

    clearInterval(progressInterval);
    setScanProgress(100);

    // Deterministic "demo" prediction based on the uploaded image bytes
    let index = 0;
    let jitter = 0;

    try {
      const buffer = await uploadedFile.arrayBuffer();
      const digest = await crypto.subtle.digest("SHA-256", buffer);
      const bytes = new Uint8Array(digest);
      index = bytes[0] % diseaseDatabase.length;
      // [-3, +3] jitter, derived from hash so same image => same result
      jitter = (bytes[1] / 255) * 6 - 3;
    } catch {
      index = Math.floor(Math.random() * diseaseDatabase.length);
      jitter = Math.random() * 6 - 3;
    }

    const base = diseaseDatabase[index];
    const detectedDisease = {
      ...base,
      confidence: Math.round((base.confidence + jitter) * 10) / 10,
    };

    setResult(detectedDisease);
    setIsAnalyzing(false);
  };

  const resetDetection = () => {
    setUploadedImage(null);
    setUploadedFile(null);
    setValidationError(null);
    setResult(null);
    setScanProgress(0);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "text-primary bg-primary/10";
      case "Medium":
        return "text-secondary bg-secondary/20";
      case "High":
        return "text-destructive bg-destructive/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <section id="detection" className="section-padding bg-muted/30">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 inline mr-1" />
            Live Demo
          </span>
          <h2 className="section-title">Disease Detection</h2>
          <p className="section-subtitle">
            Upload a wheat leaf image and watch our AI analyze it in real-time.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Area */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Upload Image</h3>
              
              {!uploadedImage ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 cursor-pointer ${
                    isDragging 
                      ? "border-primary bg-primary/5 scale-[1.02]" 
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-foreground font-medium mb-2">
                      Drag & Drop your image here
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports: JPG, PNG, WEBP (max 10MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {/* Image Preview */}
                  <div className="relative rounded-2xl overflow-hidden">
                    <img
                      src={uploadedImage}
                      alt="Uploaded wheat leaf"
                      className="w-full h-64 object-cover"
                    />
                    
                    {/* Scanning Overlay */}
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm flex flex-col items-center justify-center">
                        <div className="absolute inset-x-0 h-1 bg-primary/50 scan-animation" />
                        <Loader2 className="w-12 h-12 text-primary-foreground animate-spin mb-3" />
                        <p className="text-primary-foreground font-medium">Analyzing...</p>
                        <div className="w-48 h-2 bg-background/30 rounded-full mt-3 overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-200 rounded-full"
                            style={{ width: `${Math.min(scanProgress, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={resetDetection}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <X className="w-4 h-4 text-foreground" />
                    </button>
                  </div>

                  {/* Analyze Button */}
                  {!result && !isAnalyzing && (
                    <Button 
                      variant="hero" 
                      className="w-full mt-4"
                      onClick={analyzeImage}
                    >
                      <Sparkles className="w-5 h-5" />
                      Analyze Now
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Results Area */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Analysis Results</h3>
              
              {validationError ? (
                <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                  </div>
                  <p className="text-foreground font-medium mb-2">Not a wheat leaf photo</p>
                  <p className="text-sm text-muted-foreground max-w-sm">{validationError}</p>
                </div>
              ) : !result ? (
                <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Upload an image and click "Analyze Now" to see results</p>
                </div>
              ) : (
                <div className="space-y-6 animate-scale-in">
                  {/* Disease Name & Severity */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="w-5 h-5 text-destructive" />
                        <span className="text-sm text-muted-foreground">Disease Detected</span>
                      </div>
                      <h4 className="text-2xl font-bold text-foreground">{result.diseaseName}</h4>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(result.severity)}`}>
                      {result.severity} Severity
                    </span>
                  </div>

                  {/* Confidence Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Confidence Score</span>
                      <span className="text-sm font-semibold text-primary">{result.confidence}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000"
                        style={{ width: `${result.confidence}%` }}
                      />
                    </div>
                  </div>

                  {/* Treatment */}
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">Recommended Treatment</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{result.treatment}</p>
                  </div>

                  {/* Prevention */}
                  <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-medium text-foreground">Prevention Tips</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{result.prevention}</p>
                  </div>

                  {/* New Analysis Button */}
                  <Button variant="outline" className="w-full" onClick={resetDetection}>
                    Analyze Another Image
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
