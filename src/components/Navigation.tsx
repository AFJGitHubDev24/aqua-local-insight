import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import dolphinLogo from "@/assets/dolphin-logo.png";

interface NavigationProps {
  currentView: "hero" | "upload" | "chat";
  onNavigate: (view: "hero" | "upload" | "chat") => void;
}

const Navigation = ({ currentView, onNavigate }: NavigationProps) => {
  return (
    <header className="border-b bg-card shadow-soft">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {currentView !== "hero" && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate("hero")}
                className="mr-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            
            <div className="flex items-center space-x-2">
              <img src={dolphinLogo} alt="AquaQuery Logo" className="w-8 h-8" />
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                AquaQuery
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentView === "hero" && (
              <Button 
                variant="analytics" 
                size="sm"
                onClick={() => onNavigate("upload")}
              >
                Get Started
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;