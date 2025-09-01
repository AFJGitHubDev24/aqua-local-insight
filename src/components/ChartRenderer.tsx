import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartConfig {
  type: "bar" | "line" | "scatter" | "pie";
  title: string;
  xAxis: string;
  yAxis: string;
  aggregation?: "count" | "sum" | "avg" | "none";
  filters?: Record<string, any>;
}

interface ChartRendererProps {
  config: ChartConfig;
  data: any[];
}

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00ff00",
];

const ChartRenderer: React.FC<ChartRendererProps> = ({ config, data }) => {
  const processData = () => {
    if (!data || data.length === 0) return [];

    let processedData = [...data];

    // Apply filters if any
    if (config.filters) {
      Object.entries(config.filters).forEach(([key, value]) => {
        processedData = processedData.filter(item => item[key] === value);
      });
    }

    // Apply aggregation based on type
    if (config.aggregation && config.aggregation !== "none") {
      const grouped = processedData.reduce((acc, item) => {
        const key = item[config.xAxis];
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      }, {} as Record<string, any[]>);

      processedData = Object.entries(grouped).map(([key, items]) => {
        let value: number;
        
        switch (config.aggregation) {
          case "count":
            value = (items as any[]).length;
            break;
          case "sum":
            value = (items as any[]).reduce((sum, item) => sum + (Number(item[config.yAxis]) || 0), 0);
            break;
          case "avg":
            const sumValue = (items as any[]).reduce((sum, item) => sum + (Number(item[config.yAxis]) || 0), 0);
            value = sumValue / (items as any[]).length;
            break;
          default:
            value = Number((items as any[])[0][config.yAxis]) || 0;
        }

        return {
          [config.xAxis]: key,
          [config.yAxis]: value,
        };
      });
    }

    return processedData;
  };

  const chartData = processData();

  const renderChart = () => {
    switch (config.type) {
      case "bar":
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={config.yAxis} fill="hsl(var(--primary))" />
          </BarChart>
        );

      case "line":
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={config.yAxis} 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
            />
          </LineChart>
        );

      case "scatter":
        return (
          <ScatterChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xAxis} />
            <YAxis dataKey={config.yAxis} />
            <Tooltip />
            <Legend />
            <Scatter fill="hsl(var(--primary))" />
          </ScatterChart>
        );

      case "pie":
        return (
          <PieChart>
            <Pie
              data={chartData}
              dataKey={config.yAxis}
              nameKey={config.xAxis}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );

      default:
        return <div>Unsupported chart type: {config.type}</div>;
    }
  };

  return (
    <div className="w-full h-96 p-4 border rounded-lg bg-background">
      <h3 className="text-lg font-semibold mb-4 text-center">{config.title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartRenderer;