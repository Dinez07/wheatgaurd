import { Upload, Cpu, Search, FileCheck, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Image",
    description: "Take a photo of the affected wheat leaf and upload it to our platform.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Analysis",
    description: "Our CNN model analyzes the image patterns to detect disease signatures.",
  },
  {
    icon: Search,
    step: "03",
    title: "Disease Identified",
    description: "Get precise identification with confidence score and severity level.",
  },
  {
    icon: FileCheck,
    step: "04",
    title: "Get Treatment",
    description: "Receive tailored prevention strategies and treatment recommendations.",
  },
];

export const SolutionSection = () => {
  return (
    <section id="solution" className="section-padding">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Our Solution
          </span>
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            A simple 4-step process powered by advanced machine learning to protect your wheat crops.
          </p>
        </div>

        {/* Steps Flow */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.step} className="relative group">
                {/* Card */}
                <div className="glass-card-hover p-6 text-center h-full">
                  {/* Step Number */}
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-secondary text-secondary-foreground text-sm font-bold rounded-full">
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto mt-4 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 transition-all duration-500 group-hover:bg-primary group-hover:scale-110">
                    <step.icon className="w-8 h-8 text-primary transition-colors group-hover:text-primary-foreground" />
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow - Desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-24 -right-4 z-10 w-8 h-8 rounded-full bg-card border-2 border-primary items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tagline */}
        <div className="mt-16 text-center">
          <p className="text-2xl md:text-3xl font-semibold text-foreground">
            "Detect Early. Save Crops. <span className="text-primary">Secure Future.</span>"
          </p>
        </div>
      </div>
    </section>
  );
};
