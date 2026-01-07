import leafRust from "@/assets/disease-leaf-rust.jpg";
import stemRust from "@/assets/disease-stem-rust.jpg";
import powderyMildew from "@/assets/disease-powdery-mildew.jpg";
import septoria from "@/assets/disease-septoria.jpg";

const diseases = [
  {
    name: "Leaf Rust",
    image: leafRust,
    symptoms: "Orange-brown pustules on leaf surfaces, reduced photosynthesis, yellowing leaves.",
    severity: "High",
    prevalence: "Very Common",
  },
  {
    name: "Stem Rust",
    image: stemRust,
    symptoms: "Dark reddish-brown pustules on stems and leaves, weakened stalks, lodging.",
    severity: "Critical",
    prevalence: "Common",
  },
  {
    name: "Powdery Mildew",
    image: powderyMildew,
    symptoms: "White powdery coating on leaves and stems, stunted growth, reduced grain fill.",
    severity: "Medium",
    prevalence: "Common",
  },
  {
    name: "Septoria Leaf Blotch",
    image: septoria,
    symptoms: "Tan lesions with dark borders, premature leaf death, reduced yield.",
    severity: "High",
    prevalence: "Very Common",
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "Critical": return "bg-destructive text-destructive-foreground";
    case "High": return "bg-destructive/80 text-destructive-foreground";
    case "Medium": return "bg-secondary text-secondary-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

export const DiseasesSection = () => {
  return (
    <section id="diseases" className="section-padding">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-4">
            Disease Library
          </span>
          <h2 className="section-title">Diseases We Detect</h2>
          <p className="section-subtitle">
            Our AI is trained to identify the most common and destructive wheat diseases with high accuracy.
          </p>
        </div>

        {/* Disease Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {diseases.map((disease, index) => (
            <div
              key={disease.name}
              className="glass-card-hover overflow-hidden group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={disease.image}
                  alt={disease.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                
                {/* Severity Badge */}
                <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(disease.severity)}`}>
                  {disease.severity}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-foreground">
                    {disease.name}
                  </h3>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                    {disease.prevalence}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {disease.symptoms}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-muted-foreground mt-10">
          Our model is continuously trained on new data to improve detection accuracy and cover more diseases.
        </p>
      </div>
    </section>
  );
};
