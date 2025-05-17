import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getMockGiftIdeas } from "@/lib/mockGiftData";

// Initialize Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { occasion, interests } = await request.json();

    if (!occasion || !interests || interests.length === 0) {
      return NextResponse.json(
        { error: "Occasion and interests are required" },
        { status: 400 }
      );
    }

    const prompt = `Generate 4 thoughtful gift ideas for a ${occasion} that align with these interests: ${interests.join(
      ", "
    )}.

For each gift idea, provide in order to the JSON array:

A short, catchy title (maximum 3 words)

A description (1 sentence max) explaining why this gift is perfect

An approximate price range (Budget, Mid-range, or Luxury)

Like Meter: how much the receiver will like the gift.

You have to give me ONLY array of JSON output like this:
[{
title: ""
desc: ""
budget: ""
likeMeter: ""
},
]`;

    try {
      // Get the generative model
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Generate content
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log("Gemini API response:", text);

      // Parse the text into structured data
      const giftIdeas = parseGiftIdeas(text);

      return NextResponse.json({ giftIdeas });
    } catch (apiError: any) {
      console.error("Gemini API error:", apiError);

      // If we hit a rate limit, use fallback data
      if (
        apiError.message?.includes("429") ||
        apiError.message?.includes("quota") ||
        apiError.message?.includes("rate limit")
      ) {
        return NextResponse.json({
          giftIdeas: getMockGiftIdeas(occasion, interests),
          fromFallback: true,
        });
      }

      throw apiError;
    }
  } catch (error: any) {
    console.error("Error generating gift ideas:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate gift ideas" },
      { status: 500 }
    );
  }
}

// Helper function to parse Gemini's response into structured data
function parseGiftIdeas(text: string) {
  try {
    // Clean the text from markdown artifacts first
    const cleanedText = text.replace(/```[a-z]*|```/g, "").trim();

    // First attempt: Try to parse as JSON directly
    if (
      cleanedText.trim().startsWith("[") &&
      cleanedText.trim().endsWith("]")
    ) {
      try {
        const directParsed = JSON.parse(cleanedText);
        if (Array.isArray(directParsed) && directParsed.length > 0) {
          return directParsed.map((idea) => ({
            title: (idea.title || "Gift Idea").trim(),
            desc: (idea.desc || idea.description || "A perfect gift").trim(),
            budget: (idea.budget || idea.price || "Mid-range").trim(),
            likeMeter: (idea.likeMeter || "80%").trim(),
          }));
        }
      } catch (e) {
        console.log("Failed to parse direct JSON:", e);
        // Continue to next parsing method
      }
    }

    // Look for array-like structure with line breaks
    if (cleanedText.includes("[{") && cleanedText.includes("}]")) {
      const jsonArrayStr = cleanedText.substring(
        cleanedText.indexOf("[{"),
        cleanedText.lastIndexOf("}]") + 2
      );

      try {
        const parsedIdeas = JSON.parse(jsonArrayStr);
        return parsedIdeas.map((idea) => ({
          title: (idea.title || "Gift Idea").trim(),
          desc: (idea.desc || idea.description || "A perfect gift").trim(),
          budget: (idea.budget || idea.price || "Mid-range").trim(),
          likeMeter: (idea.likeMeter || "80%").trim(),
        }));
      } catch (e) {
        console.error("Failed to parse JSON array:", e);
        // Fall back to line-by-line parsing
      }
    }

    // Fallback: Split the text into sections
    const sections = cleanedText.split(/\d+\./).filter(Boolean);
    const fallbackIdeas = [];

    for (const section of sections) {
      const lines = section.trim().split("\n").filter(Boolean);

      if (lines.length >= 3) {
        const title = lines[0].trim();
        const desc = lines[1].trim();
        const budget =
          lines.find(
            (l) =>
              l.toLowerCase().includes("budget") ||
              l.toLowerCase().includes("price") ||
              l.toLowerCase().includes("range")
          ) || "Mid-range";

        const likeMeter =
          lines.find(
            (l) =>
              l.toLowerCase().includes("like") ||
              l.toLowerCase().includes("meter") ||
              l.toLowerCase().includes("rating")
          ) || "80%";

        fallbackIdeas.push({
          title,
          desc,
          budget,
          likeMeter,
        });
      }
    }

    if (fallbackIdeas.length > 0) {
      return fallbackIdeas;
    }

    // If all parsing attempts fail, return mock data
    return [
      {
        title: "Smart Speaker",
        desc: "A voice-controlled speaker with digital assistant features",
        budget: "Mid-range",
        likeMeter: "85%",
      },
      {
        title: "Wireless Earbuds",
        desc: "Premium wireless earbuds with noise cancellation",
        budget: "Mid-range",
        likeMeter: "90%",
      },
      {
        title: "Reusable Gift Set",
        desc: "Set of eco-friendly items like metal straws and cloth bags",
        budget: "Budget",
        likeMeter: "75%",
      },
      {
        title: "Art Supplies",
        desc: "Professional drawing and painting kit for creative expression",
        budget: "Varies",
        likeMeter: "80%",
      },
    ];
  } catch (error) {
    console.error("Error parsing gift ideas:", error);
    return [];
  }
}
