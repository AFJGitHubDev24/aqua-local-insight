import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Database, MessageSquare, TrendingUp, LogIn, UserPlus, Upload, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/hero-analytics.jpg";
import securityIcon from "@/assets/security-icon.jpg";
import excelIcon from "@/assets/excel-analysis-icon.jpg";
import chatIcon from "@/assets/chat-ai-icon.jpg";

const HeroSection = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  const handleGetStarted = () => {
    if (user) {
      window.location.hash = "upload";
    } else {
      window.location.href = "/auth";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/10">
      {/* Header */}
      <header className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AquaQuery
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              Documentation
            </Button>
            
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="w-4 h-4" />
                  <span className="text-muted-foreground">{user.email}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={() => window.location.href = "/auth"}>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-accent/50 rounded-full px-4 py-2 text-sm">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-accent-foreground font-medium">100% Local & Private</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Local Intelligence{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Analyst
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Your personal AI data analyst that understands Excel. Get instant insights 
                from your spreadsheets with natural language queries—all while keeping 
                your data 100% private on your machine.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="hero" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={handleGetStarted}
              >
                {user ? (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Excel File
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Get Started Free
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => window.location.hash = "demo"}
              >
                View Demo
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Local Processing</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Cloud Uploads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">∞</div>
                <div className="text-sm text-muted-foreground">Data Privacy</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-hero opacity-20 blur-3xl rounded-full"></div>
            <img 
              src={heroImage} 
              alt="Data Analytics Dashboard" 
              className="relative z-10 w-full rounded-2xl shadow-strong"
            />
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Powerful Analysis, <span className="text-primary">Uncompromised Privacy</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AquaQuery combines the power of large language models with advanced data analysis—all running locally on your machine.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden">
                <img src={securityIcon} alt="Security" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-semibold">100% Local & Secure</h3>
              <p className="text-muted-foreground">
                Your data never leaves your machine. All processing happens locally using open-source models.
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden">
                <img src={excelIcon} alt="Excel Analysis" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-semibold">Smart Excel Analysis</h3>
              <p className="text-muted-foreground">
                Upload any Excel file and ask questions in plain English. Get calculations, insights, and visualizations instantly.
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden">
                <img src={chatIcon} alt="AI Chat" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-semibold">Conversational Interface</h3>
              <p className="text-muted-foreground">
                No complex formulas or coding required. Simply chat with your data like you would with a human analyst.
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;