import { TrendingUp, Heart, Leaf, DollarSign, Users, Lightbulb } from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Early Detection",
    description: "Identify diseases before visible symptoms cause irreversible damage.",
  },
  {
    icon: Leaf,
    title: "Reduced Crop Loss",
    description: "Minimize yield losses through timely intervention and treatment.",
  },
  {
    icon: DollarSign,
    title: "Increased Income",
    description: "Help farmers maximize profits by protecting their harvest.",
  },
  {
    icon: Heart,
    title: "Sustainable Agriculture",
    description: "Reduce pesticide overuse through targeted treatment recommendations.",
  },
];

const targetUsers = [
  { icon: Users, label: "Farmers" },
  { icon: Lightbulb, label: "Agri Officers" },
  { icon: TrendingUp, label: "Researchers" },
];

export const ImpactSection = () => {
  return (
    <section id="impact" className="section-padding">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Why It Matters
          </span>
          <h2 className="section-title">Creating Real Impact</h2>
          <p className="section-subtitle">
            Our solution addresses critical challenges in agriculture and food security.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="glass-card-hover p-6 text-center group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:scale-110">
                <benefit.icon className="w-8 h-8 text-primary transition-colors group-hover:text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Target Users */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-secondary/10 to-primary/5 border border-secondary/20">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground">Who Benefits?</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {targetUsers.map((user) => (
              <div key={user.label} className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-card/50 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <user.icon className="w-5 h-5 text-secondary" />
                </div>
                <span className="text-lg font-medium text-foreground">{user.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Future Scope */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-6">Future Scope</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {["Drone-Based Detection", "Mobile App", "Multi-Crop Support", "Offline Mode", "Regional Languages"].map((feature) => (
              <span
                key={feature}
                className="px-5 py-2.5 rounded-full bg-muted text-foreground font-medium transition-colors hover:bg-primary/10 hover:text-primary"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
