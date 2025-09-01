import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, FileSpreadsheet, CheckCircle, BarChart3, Calculator, TrendingUp, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ExcelData } from "./ExcelParser";
import ChartRenderer from "./ChartRenderer";

interface Message {
  id: number;
  type: "user" | "assistant" | "system";
  content: string;
  code?: string;
  result?: string;
  chartConfig?: any;
  timestamp: string;
}

interface ChatInterfaceProps {
  data?: ExcelData[];
  columns?: string[];
  fileName?: string;
}

const ChatInterface = ({ data = [], columns = [], fileName = "No file loaded" }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize chat when data is loaded
  useEffect(() => {
    if (data.length > 0 && columns.length > 0) {
      const initialMessage: Message = {
        id: 1,
        type: "system",
        content: `Your file '${fileName}' is loaded and ready for analysis. I've identified ${columns.length} columns: ${columns.join(', ')}. The dataset contains ${data.length} rows. What would you like to know?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([initialMessage]);
    }
  }, [data, columns, fileName]);

  // Calculate quick stats
  const quickStats = {
    totalRows: data.length,
    totalColumns: columns.length,
    numericColumns: columns.filter(col => 
      data.length > 0 && typeof data[0][col] === 'number'
    ),
    dateColumns: columns.filter(col => 
      data.length > 0 && (
        col.toLowerCase().includes('date') || 
        col.toLowerCase().includes('time') ||
        (typeof data[0][col] === 'string' && /\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}/.test(data[0][col]))
      )
    )
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const { data: response, error } = await supabase.functions.invoke('chat-gemini', {
        body: {
          message: inputValue,
          data: data.slice(0, 100), // Send first 100 rows for context
          context: `File: ${fileName}, Columns: ${columns.join(', ')}, Total rows: ${data.length}`
        }
      });

      if (error) {
        throw error;
      }

      // Parse chart configuration if present
      let chartConfig = null;
      let cleanContent = response.response;
      
      const chartConfigMatch = response.response.match(/CHART_CONFIG:(\{[^}]+\})/);
      if (chartConfigMatch) {
        try {
          chartConfig = JSON.parse(chartConfigMatch[1]);
          cleanContent = response.response.replace(/CHART_CONFIG:\{[^}]+\}/, '').trim();
        } catch (e) {
          console.error('Failed to parse chart config:', e);
        }
      }

      const assistantMessage: Message = {
        id: messages.length + 2,
        type: "assistant",
        content: cleanContent,
        chartConfig,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Chat Error",
        description: "Failed to get response from AI. Please try again.",
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: messages.length + 2,
        type: "assistant",
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="w-6 h-6 text-primary" />
                <span className="font-medium">{fileName}</span>
              </div>
              {data.length > 0 ? (
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Loaded
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-muted text-muted-foreground">
                  No data
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{data.length} rows</span>
              <span>•</span>
              <span>{columns.length} columns</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
          {/* Chat Messages */}
          <div className="lg:col-span-2 flex flex-col">
            <Card className="flex-1 flex flex-col bg-gradient-card border-0 shadow-soft">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                  Analysis Chat
                </h2>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : message.type === 'system'
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-muted-foreground'
                    } rounded-2xl p-4 shadow-soft`}>
                       <div className="whitespace-pre-wrap">{message.content}</div>
                      
                      {message.chartConfig && (
                        <div className="mt-3">
                          <ChartRenderer config={message.chartConfig} data={data} />
                        </div>
                      )}
                      
                      {message.code && (
                        <div className="mt-3 p-3 bg-background/50 rounded-lg border">
                          <div className="text-xs text-muted-foreground mb-1">Python Code:</div>
                          <code className="text-sm font-mono">{message.code}</code>
                          {message.result && (
                            <div className="mt-2 text-sm font-semibold text-primary">
                              Result: {message.result}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="text-xs opacity-70 mt-2">{message.timestamp}</div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-muted-foreground rounded-2xl p-4 shadow-soft">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>AI is analyzing your data...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-6 border-t bg-background/50">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about your data... (e.g., 'Find the top 5 days with highest power output')"
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} variant="analytics" size="icon" disabled={isLoading || data.length === 0}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="p-6 bg-gradient-card border-0 shadow-soft">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-primary" />
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Records</span>
                  <span className="font-semibold">{quickStats.totalRows.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Columns</span>
                  <span className="font-semibold">{quickStats.totalColumns}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Numeric Columns</span>
                  <span className="font-semibold">{quickStats.numericColumns.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date Columns</span>
                  <span className="font-semibold">{quickStats.dateColumns.length}</span>
                </div>
              </div>
            </Card>

            {/* Suggested Queries */}
            <Card className="p-6 bg-gradient-card border-0 shadow-soft">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                Suggested Queries
              </h3>
              <div className="space-y-2">
                 {data.length > 0 ? [
                   "Summarize the data",
                   "Show me the first 10 rows",
                   "Calculate basic statistics",
                   "Find missing values",
                   "Plot a bar chart of the data",
                   "Create a line chart visualization",
                   "Generate Python code for data analysis"
                 ].map((query, index) => (
                  <Button 
                    key={index}
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => setInputValue(query)}
                    disabled={isLoading}
                  >
                    {query}
                  </Button>
                )) : (
                  <div className="text-sm text-muted-foreground text-center p-4">
                    Upload a file to see suggested queries
                  </div>
                )}
              </div>
            </Card>

            {/* Privacy Notice */}
            <Card className="p-4 bg-accent/10 border-accent/20">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium text-accent-foreground">100% Private</div>
                  <div className="text-muted-foreground">All analysis runs locally on your machine. Your data never leaves your device.</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;