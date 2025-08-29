import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, ArrowRight, Database } from "lucide-react";
import { parseExcelFile, ExcelData } from "./ExcelParser";
import { useToast } from "@/hooks/use-toast";

interface UploadInterfaceProps {
  onFileUploaded: (data: ExcelData[], columns: string[], fileName: string) => void;
}

const UploadInterface = ({ onFileUploaded }: UploadInterfaceProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setFileName(file.name);
    setIsProcessing(true);
    setUploadProgress(0);
    
    try {
      // Simulate initial progress
      setUploadProgress(20);
      
      // Parse the Excel file
      const { data, columns, fileName: parsedFileName } = await parseExcelFile(file);
      setUploadProgress(60);
      
      // Validate data
      if (data.length === 0) {
        throw new Error('No data rows found in the file');
      }
      
      if (columns.length === 0) {
        throw new Error('No columns found in the file');
      }
      
      setUploadProgress(90);
      
      // Complete processing
      setTimeout(() => {
        setUploadProgress(100);
        setTimeout(() => {
          setIsProcessing(false);
          onFileUploaded(data, columns, parsedFileName);
          toast({
            title: "File uploaded successfully!",
            description: `Loaded ${data.length} rows with ${columns.length} columns.`,
          });
        }, 500);
      }, 500);
      
    } catch (error) {
      setIsProcessing(false);
      setUploadProgress(0);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to process the file",
        variant: "destructive",
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const excelFile = files.find(file => 
      file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')
    );
    
    if (excelFile) {
      handleFileUpload(excelFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/10 flex items-center justify-center">
        <Card className="w-full max-w-md p-8 bg-gradient-card border-0 shadow-strong text-center">
          <div className="space-y-6">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Database className="w-8 h-8 text-primary animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Processing Your Data</h3>
              <p className="text-muted-foreground">
                Loading and analyzing <span className="font-medium">{fileName}</span>
              </p>
            </div>

            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <div className="text-sm text-muted-foreground">{uploadProgress}% complete</div>
            </div>

            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>File uploaded successfully</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Data validation complete</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                {uploadProgress >= 70 ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                )}
                <span>Initializing AI analysis engine</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

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
          <Button variant="outline" size="sm">
            Documentation
          </Button>
        </nav>
      </header>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to <span className="bg-gradient-primary bg-clip-text text-transparent">AquaQuery</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your personal AI data analyst. Upload your Excel file to get started with intelligent data analysis—all processed locally on your machine.
            </p>
          </div>

          {/* Upload Area */}
          <Card className="bg-gradient-card border-0 shadow-strong">
            <div 
              className={`p-12 border-2 border-dashed rounded-lg transition-all duration-300 ${
                isDragging 
                  ? 'border-primary bg-primary/5 scale-105' 
                  : 'border-border hover:border-primary/50'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Upload className="w-10 h-10 text-primary" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold">Upload Your Excel File</h3>
                  <p className="text-muted-foreground">
                    Drag and drop your file here, or click to browse
                  </p>
                </div>

                <div className="flex justify-center">
                  <div className="relative">
                    <input
                      id="file-upload"
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <Button variant="hero" size="lg" className="pointer-events-none">
                      <FileSpreadsheet className="w-5 h-5 mr-2" />
                      Choose File
                    </Button>
                  </div>
                </div>

                <div className="flex justify-center space-x-2">
                  <Badge variant="secondary">.xlsx</Badge>
                  <Badge variant="secondary">.xls</Badge>
                  <Badge variant="secondary">.csv</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="p-6 bg-gradient-card border-0 shadow-soft text-center">
              <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
              <h3 className="font-semibold mb-2">100% Private</h3>
              <p className="text-sm text-muted-foreground">
                Your data never leaves your machine. All processing happens locally.
              </p>
            </Card>

            <Card className="p-6 bg-gradient-card border-0 shadow-soft text-center">
              <Database className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Smart Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Ask questions in plain English and get instant insights from your data.
              </p>
            </Card>

            <Card className="p-6 bg-gradient-card border-0 shadow-soft text-center">
              <ArrowRight className="w-12 h-12 text-chart-2 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Instant Results</h3>
              <p className="text-sm text-muted-foreground">
                Get calculations, visualizations, and insights in seconds.
              </p>
            </Card>
          </div>

          {/* Security Notice */}
          <Card className="mt-8 p-6 bg-accent/10 border-accent/20">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold text-accent-foreground mb-2">Your Privacy is Guaranteed</h4>
                <p className="text-sm text-muted-foreground">
                  AquaQuery runs entirely on your local machine using open-source AI models. 
                  Your Excel data is never uploaded to the cloud or shared with any external services. 
                  All analysis happens offline, ensuring complete privacy and security of your sensitive information.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadInterface;