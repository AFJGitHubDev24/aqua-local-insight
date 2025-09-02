import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, MessageSquare, Calculator, BarChart3, Shield, Lightbulb, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dolphinLogo from "@/assets/dolphin-logo.png";

const Documentation = () => {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header for screen view */}
      <div className="bg-card border-b shadow-soft print:hidden">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/")}
                className="mr-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to App
              </Button>
              <div className="flex items-center space-x-2">
                <img src={dolphinLogo} alt="AquaQuery Logo" className="w-8 h-8" />
                <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  AquaQuery Documentation
                </span>
              </div>
            </div>
            <Button onClick={handlePrint} variant="analytics">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Print header */}
      <div className="hidden print:block text-center py-4 border-b">
        <div className="text-sm text-muted-foreground">User Manual: AquaQuery Local Intelligence Analyst</div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Title Page */}
        <div className="text-center mb-16 page-break-after">
          <div className="mb-8">
            <img src={dolphinLogo} alt="AquaQuery Logo" className="w-24 h-24 mx-auto mb-6" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            AquaQuery: Local Intelligence Analyst
          </h1>
          <h2 className="text-2xl text-muted-foreground mb-8">
            Your Secure, On-Premise AI for Data Analysis
          </h2>
          <div className="space-y-2 text-lg">
            <p><strong>Version:</strong> 1.0</p>
            <p><strong>Date:</strong> September 2025</p>
          </div>
        </div>

        {/* Table of Contents */}
        <Card className="mb-16 p-8 page-break-after">
          <h2 className="text-3xl font-bold mb-6 text-center">Table of Contents</h2>
          <div className="space-y-2 text-lg">
            <div className="flex justify-between border-b border-border/50 pb-1">
              <span>1. Introduction</span>
              <span>3</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-1">
              <span>2. Key Features</span>
              <span>4</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-1">
              <span>3. How to Use: A Quick Start Guide</span>
              <span>5</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-1">
              <span>4. Example Queries You Can Ask</span>
              <span>6</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-1">
              <span>5. Technical Architecture</span>
              <span>7</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-1">
              <span>6. Our Commitment to Your Privacy</span>
              <span>8</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-1">
              <span>7. Frequently Asked Questions</span>
              <span>9</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-1">
              <span>8. Contact & Support</span>
              <span>10</span>
            </div>
          </div>
        </Card>

        {/* Section 1: Introduction */}
        <Card className="mb-12 p-8 page-break-before">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <span className="mr-3">1.</span>
            Introduction
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-xl leading-relaxed mb-6">
              Welcome to the Local Intelligence Analyst.
            </p>
            <p className="leading-relaxed mb-4">
              This application is a powerful, secure, and private AI-powered chatbot designed to help you analyze and visualize your complex spreadsheet data. By leveraging the power of Large Language Models directly on your computer, it allows you to ask questions in plain English and get instant insights, calculations, and charts.
            </p>
            <p className="leading-relaxed">
              Our primary mission is to provide a robust data analysis tool that respects your privacy. All your files and conversations remain on your local machine and are <strong>never sent to the cloud</strong>. This makes it the perfect tool for analyzing sensitive or proprietary data, such as the pilot testing data from your wave-powered desalination plant.
            </p>
          </div>
        </Card>

        {/* Section 2: Key Features */}
        <Card className="mb-12 p-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <span className="mr-3">2.</span>
            Key Features
          </h2>
          <div className="grid gap-6">
            <div className="flex items-start space-x-4">
              <MessageSquare className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Conversational Data Analysis</h3>
                <p>Simply ask questions in natural language.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Calculator className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">On-the-Fly Calculations</h3>
                <p>Perform a wide range of calculations, from simple averages to complex correlations.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <BarChart3 className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Instant Visualizations</h3>
                <p>Generate insightful charts and graphs to visually explore your data.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Shield className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">100% Local and Secure</h3>
                <p>The AI model and your data all run entirely on your computer.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Lightbulb className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Transparent by Design</h3>
                <p>For advanced users, the chatbot can show the underlying Python code it uses to generate answers.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Database className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Supports Common Formats</h3>
                <p>Easily upload and analyze standard <code>.xlsx</code> and <code>.csv</code> files.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Section 3: Getting Started */}
        <Card className="mb-12 p-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <span className="mr-3">3.</span>
            How to Use: A Quick Start Guide
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Launch the Application</h3>
                <p>Open the Local Intelligence Analyst application.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Upload Your Data</h3>
                <p>Click the <strong>"Upload File"</strong> button and select the Excel (<code>.xlsx</code>) or CSV (<code>.csv</code>) file you want to analyze.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Receive Confirmation</h3>
                <p>The chatbot will confirm that your file is loaded and ready by displaying the column headers it has identified.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1">
                4
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Start Asking Questions</h3>
                <p>Use the chat input box to ask your questions.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Section 4: Example Queries */}
        <Card className="mb-12 p-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <span className="mr-3">4.</span>
            Example Queries You Can Ask
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary">Basic Data Lookups</h3>
              <div className="space-y-2 text-lg">
                <p>• "What was the <code>FW_OUT_FM02_m3h</code> at 11:00:05?"</p>
                <p>• "Find the row with the highest <code>PowerCenter_RPM</code>."</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary">Analytical Questions</h3>
              <div className="space-y-2 text-lg">
                <p>• "What is the average <code>Roboteq_Current_A</code>?"</p>
                <p>• "What is the correlation between <code>MRU_Heave_m</code> and <code>PowerCenter_RPM</code>?"</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary">Visualization Requests</h3>
              <div className="space-y-2 text-lg">
                <p>• "Plot the <code>FW_OUT_FM02_m3h</code> over time."</p>
                <p>• "Create a scatter plot of <code>MRU_Heave_m</code> versus <code>Roboteq_Current_A</code>."</p>
                <p>• "Show me a histogram of the <code>HP_ACC_Press_PT18_Bar</code>."</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Section 5: Technical Architecture */}
        <Card className="mb-12 p-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <span className="mr-3">5.</span>
            Technical Architecture
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="leading-relaxed mb-4">
              For those interested, the chatbot is built on a modern, secure architecture:
            </p>
            <ul className="space-y-3 text-lg">
              <li><strong>Language Model (LLM):</strong> It uses a powerful open-source model that runs locally via the <strong>Ollama</strong> framework.</li>
              <li><strong>Orchestration:</strong> The AI's logic is managed by the <strong>LangChain</strong> library.</li>
              <li><strong>Data Analysis Engine:</strong> The core analytical capability is powered by a <strong>Pandas DataFrame Agent</strong>, which allows the AI to execute Python code to perform calculations.</li>
            </ul>
          </div>
        </Card>

        {/* Section 6: Privacy */}
        <Card className="mb-12 p-8 border-primary/50 bg-primary/5">
          <h2 className="text-3xl font-bold mb-6 flex items-center text-primary">
            <Shield className="w-8 h-8 mr-3" />
            <span className="mr-3">6.</span>
            Our Commitment to Your Privacy
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-xl font-bold mb-4 text-primary">
              Your data's security is our highest priority.
            </p>
            <p className="leading-relaxed text-lg">
              The entire application is self-contained. When you upload a file, it is processed in your computer's memory and is not stored or sent over any network. The AI model that analyzes the data also runs on your machine. This design ensures that your sensitive information remains completely private and under your control at all times.
            </p>
          </div>
        </Card>

        {/* Section 7: FAQ */}
        <Card className="mb-12 p-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <span className="mr-3">7.</span>
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Q: Why isn't my chart showing?</h3>
              <p className="text-muted-foreground">
                <strong>A:</strong> This is often due to a typo in a column name or the data not being in a numeric format. Please double-check your query.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Q: What happens if the chatbot can't answer a question?</h3>
              <p className="text-muted-foreground">
                <strong>A:</strong> It will inform you and may ask for clarification.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Q: Is there a file size limit?</h3>
              <p className="text-muted-foreground">
                <strong>A:</strong> Performance depends on your computer's RAM. For very large files, analysis may be slow.
              </p>
            </div>
          </div>
        </Card>

        {/* Section 8: Contact */}
        <Card className="mb-12 p-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <span className="mr-3">8.</span>
            Contact & Support
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="leading-relaxed mb-4">
              For technical issues or questions not covered in this manual, please contact our support team at:
            </p>
            <ul className="space-y-2 text-lg">
              <li><strong>Email:</strong> [Enter Your Support Email Here]</li>
              <li><strong>Website:</strong> [Enter Your Website Here]</li>
            </ul>
          </div>
        </Card>
      </div>

      {/* Print footer */}
      <div className="hidden print:block text-center py-4 border-t text-sm text-muted-foreground">
        <div>Page | Confidential & Proprietary</div>
      </div>

      {/* Print styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            .page-break-after {
              page-break-after: always;
            }
            .page-break-before {
              page-break-before: always;
            }
            @page {
              margin: 1in;
              size: letter;
            }
            body {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
          }
        `
      }} />
    </div>
  );
};

export default Documentation;