import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, AlertCircle, CheckCircle, Image as ImageIcon, X, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DetectionResult {
  diseaseName: string;
  severity: "Low" | "Medium" | "High";
  confidence: number;
  treatment: string;
  prevention: string;
}

// Removed local validation - now handled by Gemini AI

export const DetectionSection = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const { toast } = useToast();

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
    if (!uploadedImage) return;

    setValidationError(null);
    setIsAnalyzing(true);
    setScanProgress(0);

    // Progress animation
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) {
          return prev;
        }
        return prev + Math.random() * 10;
      });
    }, 300);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-wheat-disease", {
        body: { imageBase64: uploadedImage },
      });

      clearInterval(progressInterval);
      setScanProgress(100);

      if (error) {
        console.error("Edge function error:", error);
        toast({
          title: "Analysis Failed",
          description: error.message || "Failed to analyze image",
          variant: "destructive",
        });
        setIsAnalyzing(false);
        return;
      }

      if (data.error) {
        toast({
          title: "Analysis Error",
          description: data.error,
          variant: "destructive",
        });
        setIsAnalyzing(false);
        return;
      }

      // Check if it's a wheat leaf
      if (!data.isWheatLeaf) {
        setValidationError(data.message || "This doesn't appear to be a wheat leaf photo. Please upload a clear image of a wheat leaf.");
        setResult(null);
        setIsAnalyzing(false);
        return;
      }

      // Check for healthy wheat
      if (data.disease?.name === "Healthy" || !data.disease?.name) {
        setResult({
          diseaseName: "Healthy",
          severity: "Low",
          confidence: data.disease?.confidence || 95,
          treatment: "No treatment required. The wheat leaf appears healthy.",
          prevention: "Continue regular monitoring and maintain good agricultural practices.",
        });
        setIsAnalyzing(false);
        return;
      }

      // Disease detected
      setResult({
        diseaseName: data.disease.name,
        severity: data.disease.severity || "Medium",
        confidence: data.disease.confidence || 85,
        treatment: data.disease.treatment || "Consult an agricultural expert for specific treatment recommendations.",
        prevention: data.disease.prevention || "Implement crop rotation and use disease-resistant varieties.",
      });
      setIsAnalyzing(false);
    } catch (err) {
      clearInterval(progressInterval);
      console.error("Analysis error:", err);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the analysis service. Please try again.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
  };

  const resetDetection = () => {
    setUploadedImage(null);
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
