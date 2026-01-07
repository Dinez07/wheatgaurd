import { Leaf, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navLinks = [
  { name: "Problem", href: "#problem" },
  { name: "Solution", href: "#solution" },
  { name: "Detection", href: "#detection" },
  { name: "Diseases", href: "#diseases" },
  { name: "Technology", href: "#technology" },
  { name: "Impact", href: "#impact" },
];

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:block">
              Wheat<span className="text-primary">Guard</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg hover:bg-muted"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              variant="default" 
              size="default"
              onClick={() => document.getElementById("detection")?.scrollIntoView({ behavior: "smooth" })}
            >
              Try Detection
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-2">
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    document.getElementById("detection")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Try Detection
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
