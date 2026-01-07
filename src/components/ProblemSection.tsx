import { AlertTriangle, Clock, Users, TrendingDown } from "lucide-react";

const problems = [
  {
    icon: Clock,
    title: "Late Detection",
    description: "Farmers often detect diseases only when symptoms become severe, leading to irreversible damage.",
  },
  {
    icon: TrendingDown,
    title: "Massive Crop Loss",
    description: "Delayed diagnosis results in 20-40% annual crop loss, severely impacting food security.",
  },
  {
    icon: Users,
    title: "Limited Expert Access",
    description: "Rural farmers have minimal access to agricultural experts and plant pathologists.",
  },
  {
    icon: AlertTriangle,
    title: "Knowledge Gap",
    description: "Many farmers lack awareness about disease symptoms and effective prevention methods.",
  },
];

export const ProblemSection = () => {
  return (
    <section id="problem" className="section-padding bg-muted/30">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-4">
            The Challenge
          </span>
          <h2 className="section-title">The Problem We're Solving</h2>
          <p className="section-subtitle">
            Wheat diseases cause billions in losses annually. Early detection is crucial but remains a challenge for most farmers.
          </p>
        </div>

        {/* Problem Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <div
              key={problem.title}
              className="glass-card-hover p-6 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mb-5 transition-all duration-300 group-hover:bg-destructive/20 group-hover:scale-110">
                <problem.icon className="w-7 h-7 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {problem.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        {/* Impact Stats */}
        <div className="mt-16 p-8 rounded-3xl bg-destructive/5 border border-destructive/10">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-destructive mb-2">$5B+</div>
              <div className="text-muted-foreground">Annual Global Losses</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-destructive mb-2">30%</div>
              <div className="text-muted-foreground">Average Yield Reduction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-destructive mb-2">200M+</div>
              <div className="text-muted-foreground">Farmers Affected</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
