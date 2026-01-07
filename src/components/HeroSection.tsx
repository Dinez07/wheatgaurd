import { Button } from "@/components/ui/button";
import { Upload, Play, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-wheat-field.jpg";

export const HeroSection = () => {
  const scrollToDetection = () => {
    document.getElementById("detection")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToSolution = () => {
    document.getElementById("solution")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Wheat field at sunrise"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        <div className="absolute inset-0 bg-hero-pattern" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-primary/10 blur-2xl float-animation" />
      <div className="absolute bottom-1/3 right-10 w-32 h-32 rounded-full bg-secondary/20 blur-3xl float-animation" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-accent/15 blur-2xl float-animation" style={{ animationDelay: "4s" }} />

      {/* Content */}
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Crop Health Analysis</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 leading-tight animate-fade-in-up delay-100">
            Early Detection of{" "}
            <span className="gradient-text">Wheat Diseases</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
            Upload a leaf image and get instant disease detection with preventive recommendations. 
            Protect your crops before it's too late.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-300">
            <Button variant="hero" onClick={scrollToDetection} className="group">
              <Upload className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
              Upload Wheat Leaf Image
            </Button>
            <Button variant="heroOutline" onClick={scrollToSolution} className="group">
              <Play className="w-5 h-5 transition-transform group-hover:scale-110" />
              View How It Works
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-border/30 animate-fade-in-up delay-400">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground">95%</div>
              <div className="text-sm text-muted-foreground mt-1">Detection Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground">&lt;3s</div>
              <div className="text-sm text-muted-foreground mt-1">Analysis Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground">4+</div>
              <div className="text-sm text-muted-foreground mt-1">Diseases Covered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};
