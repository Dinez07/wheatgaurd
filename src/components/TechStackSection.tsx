import { Code2, Database, Brain, Layers, Globe, Server } from "lucide-react";

const technologies = [
  {
    category: "Frontend",
    icon: Globe,
    items: ["React.js", "TypeScript", "Tailwind CSS"],
    color: "bg-accent/10 text-accent",
  },
  {
    category: "Backend",
    icon: Server,
    items: ["Python", "FastAPI", "Flask"],
    color: "bg-primary/10 text-primary",
  },
  {
    category: "AI/ML",
    icon: Brain,
    items: ["TensorFlow", "PyTorch", "CNN Model"],
    color: "bg-secondary/20 text-secondary-foreground",
  },
  {
    category: "Dataset",
    icon: Database,
    items: ["PlantVillage", "Kaggle", "Custom Data"],
    color: "bg-destructive/10 text-destructive",
  },
  {
    category: "Architecture",
    icon: Layers,
    items: ["ResNet", "VGG-16", "Transfer Learning"],
    color: "bg-accent/10 text-accent",
  },
  {
    category: "Tools",
    icon: Code2,
    items: ["Jupyter", "Git", "Docker"],
    color: "bg-primary/10 text-primary",
  },
];

export const TechStackSection = () => {
  return (
    <section id="technology" className="section-padding bg-muted/30">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Under the Hood
          </span>
          <h2 className="section-title">Technology Stack</h2>
          <p className="section-subtitle">
            Built with cutting-edge technologies for reliable and accurate disease detection.
          </p>
        </div>

        {/* Tech Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {technologies.map((tech, index) => (
            <div
              key={tech.category}
              className="glass-card-hover p-6 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${tech.color}`}>
                  <tech.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {tech.category}
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {tech.items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 bg-muted rounded-lg text-sm text-foreground font-medium transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Model Architecture Highlight */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              CNN-Based Deep Learning Model
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Our model uses Convolutional Neural Networks (CNN) with transfer learning from pre-trained architectures. 
              Trained on thousands of wheat leaf images, it achieves 95%+ accuracy in detecting multiple disease types.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
