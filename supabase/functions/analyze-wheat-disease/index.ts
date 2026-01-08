import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Maximum allowed base64 size (~10MB image = ~13MB base64)
const MAX_BASE64_SIZE = 13 * 1024 * 1024;

// Validate base64 image format
function validateImageBase64(imageBase64: unknown): { valid: boolean; error?: string } {
  if (!imageBase64) {
    return { valid: false, error: "No image provided" };
  }

  if (typeof imageBase64 !== "string") {
    return { valid: false, error: "Invalid image format: expected string" };
  }

  // Check for valid data URL prefix for supported image types
  const base64Regex = /^data:image\/(jpeg|jpg|png|webp|gif);base64,/;
  if (!base64Regex.test(imageBase64)) {
    return { valid: false, error: "Invalid image format. Supported formats: JPEG, PNG, WEBP, GIF" };
  }

  // Check size
  if (imageBase64.length > MAX_BASE64_SIZE) {
    return { valid: false, error: "Image too large. Maximum size is 10MB" };
  }

  return { valid: true };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check Content-Length header first to reject large requests early
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 15 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: "Request too large. Maximum size is 10MB" }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { imageBase64 } = body;

    // Validate image input
    const validation = validateImageBase64(imageBase64);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Analyzing wheat image with Gemini vision...");

    const systemPrompt = `You are an expert agricultural pathologist specializing in wheat diseases. 
Analyze the provided image and determine:
1. Whether this is a wheat leaf photo
2. If it is a wheat leaf, identify any disease present

You MUST respond with a valid JSON object (no markdown, no extra text) in this exact format:
{
  "isWheatLeaf": boolean,
  "disease": {
    "name": string or null,
    "severity": "Low" | "Medium" | "High" | null,
    "confidence": number (0-100) or null,
    "treatment": string or null,
    "prevention": string or null
  },
  "message": string (explanation if not a wheat leaf, or brief description of findings)
}

Known wheat diseases to look for:
- Leaf Rust (orange-brown pustules on leaves)
- Stem Rust (reddish-brown pustules on stems)
- Powdery Mildew (white powdery coating)
- Septoria Leaf Blotch (tan lesions with dark borders)
- Yellow Rust/Stripe Rust (yellow stripes on leaves)
- Fusarium Head Blight (bleached heads with pink/orange spores)
- Tan Spot (tan oval lesions)
- Take-All (blackened roots, stunted plants)

If the image is NOT a wheat leaf (e.g., person, animal, sky, random object, other plants), set isWheatLeaf to false and provide a helpful message.

If the wheat leaf appears healthy with no visible disease, set disease.name to "Healthy" with appropriate confidence.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this image for wheat disease detection:" },
              {
                type: "image_url",
                image_url: { url: imageBase64 },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service quota exceeded." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Failed to analyze image" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response:", data);
      return new Response(
        JSON.stringify({ error: "No analysis result received" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("AI response content:", content);

    // Parse the JSON response (handle potential markdown wrapping)
    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError, content);
      return new Response(
        JSON.stringify({ error: "Failed to parse analysis result" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Analysis result:", result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-wheat-disease:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
