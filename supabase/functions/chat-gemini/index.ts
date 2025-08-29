import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { message, data, context } = await req.json();
    
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
4. Generate visualizations recommendations
5. Answer questions about data patterns and relationships

Guidelines:
- Always provide complete Python code when requested (including imports, data setup, and full implementation)
- Use libraries like pandas, matplotlib, seaborn, numpy for analysis
- Make code production-ready with proper error handling
- Explain the analysis approach clearly
- Reference specific data points from the uploaded file when possible`;

    if (data && data.length > 0) {
      systemPrompt += `\n\nCurrent dataset context:
- Total rows: ${data.length}
- Columns: ${Object.keys(data[0] || {}).join(', ')}
- Sample data (first 3 rows): ${JSON.stringify(data.slice(0, 3), null, 2)}`;
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