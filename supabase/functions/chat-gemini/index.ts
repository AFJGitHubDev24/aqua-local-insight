import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Local data processing functions for large datasets
function executeLocalQuery(data: any[], queryType: string, params: any) {
  switch (queryType) {
    case 'filter':
      return filterData(data, params);
    case 'groupBy':
      return groupByColumn(data, params);
    case 'sort':
      return sortData(data, params);
    case 'aggregate':
      return aggregateData(data, params);
    case 'topN':
      return getTopN(data, params);
    default:
      throw new Error(`Unknown query type: ${queryType}`);
  }
}

function filterData(data: any[], params: { column: string; operator: string; value: any }) {
  const { column, operator, value } = params;
  let filtered = data;

  switch (operator) {
    case 'equals':
      filtered = data.filter(row => row[column] == value);
      break;
    case 'greater':
      filtered = data.filter(row => Number(row[column]) > Number(value));
      break;
    case 'less':
      filtered = data.filter(row => Number(row[column]) < Number(value));
      break;
    case 'contains':
      filtered = data.filter(row => String(row[column]).toLowerCase().includes(String(value).toLowerCase()));
      break;
  }

  return {
    description: `Filtered ${filtered.length} rows where ${column} ${operator} ${value}`,
    data: filtered.slice(0, 100) // Limit for token efficiency
  };
}

function groupByColumn(data: any[], params: { column: string; aggregateColumn?: string; aggregateFunction?: string }) {
  const { column, aggregateColumn, aggregateFunction = 'count' } = params;
  const groups: { [key: string]: any[] } = {};

  data.forEach(row => {
    const key = row[column];
    if (!groups[key]) groups[key] = [];
    groups[key].push(row);
  });

  const result = Object.entries(groups).map(([key, items]) => {
    const groupResult: any = { [column]: key, count: items.length };
    
    if (aggregateColumn && aggregateFunction !== 'count') {
      const values = items.map(item => Number(item[aggregateColumn])).filter(val => !isNaN(val));
      switch (aggregateFunction) {
        case 'sum':
          groupResult[`${aggregateFunction}_${aggregateColumn}`] = values.reduce((a, b) => a + b, 0);
          break;
        case 'avg':
          groupResult[`${aggregateFunction}_${aggregateColumn}`] = values.reduce((a, b) => a + b, 0) / values.length;
          break;
        case 'max':
          groupResult[`${aggregateFunction}_${aggregateColumn}`] = Math.max(...values);
          break;
        case 'min':
          groupResult[`${aggregateFunction}_${aggregateColumn}`] = Math.min(...values);
          break;
      }
    }
    
    return groupResult;
  });

  return {
    description: `Grouped by ${column}`,
    data: result
  };
}

function sortData(data: any[], params: { column: string; direction: 'asc' | 'desc' }) {
  const { column, direction } = params;
  const sorted = [...data].sort((a, b) => {
    const aVal = a[column];
    const bVal = b[column];
    return direction === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
  });

  return {
    description: `Sorted by ${column} ${direction}`,
    data: sorted.slice(0, 100)
  };
}

function aggregateData(data: any[], params: { column: string; functions: string[] }) {
  const { column, functions } = params;
  const values = data.map(row => Number(row[column])).filter(val => !isNaN(val));
  
  const result: any = {};
  functions.forEach(func => {
    switch (func) {
      case 'count':
        result.count = values.length;
        break;
      case 'sum':
        result.sum = values.reduce((a, b) => a + b, 0);
        break;
      case 'avg':
        result.average = values.reduce((a, b) => a + b, 0) / values.length;
        break;
      case 'max':
        result.maximum = Math.max(...values);
        break;
      case 'min':
        result.minimum = Math.min(...values);
        break;
    }
  });

  return {
    description: `Statistics for ${column}`,
    data: [result]
  };
}

function getTopN(data: any[], params: { column: string; n: number; sortBy?: string }) {
  const { column, n, sortBy = 'count' } = params;
  const grouped = groupByColumn(data, { column });
  const sorted = grouped.data.sort((a, b) => b[sortBy] - a[sortBy]);

  return {
    description: `Top ${n} values in ${column}`,
    data: sorted.slice(0, n)
  };
}

function generateDataSummary(data: any[], columns: string[]) {
  let summary = `Columns: ${columns.join(', ')}\n`;
  
  columns.slice(0, 10).forEach(col => { // Limit to first 10 columns to avoid token issues
    const values = data.map(row => row[col]).filter(val => val !== null && val !== undefined && val !== '');
    const uniqueCount = new Set(values).size;
    const isNumeric = values.every(val => !isNaN(Number(val)) && val !== '');
    
    summary += `\n${col}:
  - Type: ${isNumeric ? 'numeric' : 'text'}
  - Non-null values: ${values.length}
  - Unique values: ${uniqueCount}`;
    
    if (isNumeric && values.length > 0) {
      const numValues = values.map(Number);
      summary += `
  - Min: ${Math.min(...numValues)}
  - Max: ${Math.max(...numValues)}
  - Average: ${(numValues.reduce((a, b) => a + b, 0) / numValues.length).toFixed(2)}`;
    } else {
      summary += `
  - Sample values: ${[...new Set(values)].slice(0, 3).join(', ')}`;
    }
  });
  
  return summary;
}

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, data, context, queryType, queryParams } = await req.json();
    
    console.log('Received request:', { message, dataLength: data?.length, context });

    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    // Prepare context for Gemini
    let systemPrompt = `You are AquaQuery, an advanced data analysis AI assistant specialized in Excel/CSV data analysis. 

Key capabilities:
1. Analyze uploaded spreadsheet data thoroughly
2. Provide statistical insights and trends
3. When users ask for Python code, provide COMPLETE, executable code snippets (not just one-liners)
4. Create actual visualizations when requested
5. Answer questions about data patterns and relationships

CRITICAL VISUALIZATION BEHAVIOR:
When users request visualizations (words like "plot", "chart", "graph", "visualize", "show"):
1. Generate a chart configuration in this EXACT format (on separate lines):
   CHART_CONFIG:
   {"type":"line","title":"Time Series Chart","xAxis":"date_column","yAxis":"value_column","aggregation":"none"}
2. Follow with a brief explanation of what the chart shows
3. ONLY show Python code if the user explicitly asks for "code" or "script"

When users ask for code explicitly:
1. First provide the chart configuration as above
2. Then provide complete Python code in a code block

Guidelines:
- Always provide complete Python code when requested (including imports, data setup, and full implementation)
- Use libraries like pandas, matplotlib, seaborn, numpy for analysis
- Make code production-ready with proper error handling
- Explain the analysis approach clearly
- Reference specific data points from the uploaded file when possible`;

    // Handle specific query requests for large datasets
    if (queryType && queryParams && data) {
      try {
        const queryResult = executeLocalQuery(data, queryType, queryParams);
        systemPrompt += `\n\nQuery Result:
Query: ${queryType} with parameters ${JSON.stringify(queryParams)}
Result: ${JSON.stringify(queryResult, null, 2)}

Please analyze and explain this query result in the context of the user's question.`;
      } catch (error) {
        console.error('Query execution error:', error);
        systemPrompt += `\n\nQuery execution failed: ${error.message}`;
      }
    } else if (data && data.length > 0) {
      // For large datasets, provide strategic summary instead of raw data
      const isLargeDataset = data.length > 1000;
      
      if (isLargeDataset) {
        // Generate comprehensive data summary for large datasets
        const columns = Object.keys(data[0] || {});
        const dataSummary = generateDataSummary(data, columns);
        
        systemPrompt += `\n\nLarge Dataset Summary (${data.length} rows):
${dataSummary}

IMPORTANT: For detailed analysis on large datasets, guide the user to ask specific questions like:
- "Show me top 10 records by [column]"
- "Filter data where [column] > [value]"  
- "Group by [column] and count"
- "Calculate correlation between [col1] and [col2]"
- "Show statistics for [column]"

This approach allows precise analysis without token limits.`;
      } else {
        // For smaller datasets, use current sampling approach
        const sampleSize = Math.min(50, data.length);
        const sampleData = data.slice(0, sampleSize);

        systemPrompt += `\n\nDataset context:
- Total rows: ${data.length}
- Columns: ${Object.keys(data[0] || {}).join(', ')}
- Complete data: ${JSON.stringify(sampleData, null, 2)}`;
      }
    }

    if (context) {
      systemPrompt += `\n\nAdditional context: ${context}`;
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: `User question: ${message}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Gemini response:', result);

    if (!result.candidates || result.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }

    const generatedText = result.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ 
      response: generatedText,
      usage: result.usageMetadata 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-gemini function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Check function logs for more information' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});