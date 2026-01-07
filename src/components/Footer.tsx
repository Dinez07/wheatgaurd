import { Leaf, Github, ExternalLink, Mail, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">
                Wheat<span className="text-primary">Guard</span>
              </span>
            </a>
            <p className="text-primary-foreground/70 leading-relaxed max-w-md mb-6">
              AI-powered early detection of wheat diseases. Helping farmers protect their crops and secure food production through cutting-edge machine learning technology.
            </p>
            <p className="text-lg font-semibold text-primary">
              "Detect Early. Save Crops. Secure Future."
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {["Problem", "Solution", "Detection", "Diseases", "Technology", "Impact"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-primary-foreground/70 hover:text-primary transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Project Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Project</h4>
            <div className="space-y-4">
              <a
                href="#"
                className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>View on GitHub</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Live Demo</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>Contact Us</span>
              </a>
            </div>

            <div className="mt-8">
              <h5 className="text-sm font-medium text-primary-foreground/50 mb-3">HACKATHON</h5>
              <p className="text-primary-foreground/70">AgriTech Innovation 2025</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/50 text-sm">
              © 2025 WheatGuard. Built for agricultural innovation.
            </p>
            <p className="flex items-center gap-2 text-sm text-primary-foreground/50">
              Made with <Heart className="w-4 h-4 text-destructive fill-destructive" /> by Team AgriAI
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
