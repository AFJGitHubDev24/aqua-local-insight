import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, FileSpreadsheet, CheckCircle, BarChart3, Calculator, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const sampleData = [
  { date: "Jan", powerOutput: 45, waveHeight: 2.1 },
  { date: "Feb", powerOutput: 52, waveHeight: 2.8 },
  { date: "Mar", powerOutput: 48, waveHeight: 2.3 },
  { date: "Apr", powerOutput: 61, waveHeight: 3.2 },
  { date: "May", powerOutput: 55, waveHeight: 2.9 },
  { date: "Jun", powerOutput: 67, waveHeight: 3.5 },
];

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "system",
      content: "Your file 'Wave_Energy_Data_2024.xlsx' is loaded and ready for analysis. I've identified the following columns: Date, Power Output (kWh), Wave Height (m), Wind Speed (mph), Maintenance Status. What would you like to know?",
      timestamp: "10:30 AM"
    },
    {
      id: 2,
      type: "user",
      content: "What was the average power output for the entire dataset?",
      timestamp: "10:31 AM"
    },
    {
      id: 3,
      type: "assistant",
      content: "The average power output for the entire dataset is **54.7 kWh**.",
      code: "df['Power Output (kWh)'].mean()",
      result: "54.7",
      timestamp: "10:31 AM"
    },
    {
      id: 4,
      type: "user",
      content: "Show me the relationship between wave height and power output",
      timestamp: "10:32 AM"
    }
  ]);

  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      type: "user" as const,
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setInputValue("");
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
                <span className="font-medium">Wave_Energy_Data_2024.xlsx</span>
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                <CheckCircle className="w-3 h-3 mr-1" />
                Loaded
              </Badge>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>1,247 rows</span>
              <span>•</span>
              <span>5 columns</span>
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

                {/* Chart Response */}
                <div className="flex justify-start">
                  <div className="max-w-[80%] bg-muted text-muted-foreground rounded-2xl p-4 shadow-soft">
                    <div className="mb-3">Here's a scatter plot showing the relationship between wave height and power output:</div>
                    <div className="bg-background rounded-lg p-4 border">
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={sampleData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Bar yAxisId="left" dataKey="powerOutput" fill="hsl(var(--primary))" />
                          <Line yAxisId="right" type="monotone" dataKey="waveHeight" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-xs opacity-70 mt-2">10:32 AM</div>
                  </div>
                </div>
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
                  <Button onClick={handleSendMessage} variant="analytics" size="icon">
                    <Send className="w-4 h-4" />
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
                  <span className="text-muted-foreground">Avg Power Output</span>
                  <span className="font-semibold">54.7 kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Wave Height</span>
                  <span className="font-semibold">3.5 m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Records</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date Range</span>
                  <span className="font-semibold">2024</span>
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
                {[
                  "Show trends over time",
                  "Find correlation patterns",
                  "Identify peak performance days",
                  "Calculate monthly averages",
                  "Detect maintenance patterns"
                ].map((query, index) => (
                  <Button 
                    key={index}
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => setInputValue(query)}
                  >
                    {query}
                  </Button>
                ))}
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