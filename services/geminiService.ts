
import { GoogleGenAI, Type } from "@google/genai";
import { Category, Tone, Length, Style, QuoteData, GenerationConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateQuote = async (config: GenerationConfig): Promise<QuoteData> => {
  const prompt = `Generate a ${config.length} motivational quote in a ${config.tone} tone for the category of ${config.category}. 
  The quote should be inspiring, positive, and focused on growth. 
  Avoid unrealistic promises or negative language.
  Format the response as a JSON object with "text" and "author" fields.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          author: { type: Type.STRING }
        },
        required: ["text", "author"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text || '{}');
    return {
      text: data.text || "Believe in the journey.",
      author: data.author || "InspireAI"
    };
  } catch (e) {
    return { text: "Focus on the step you are taking today.", author: "InspireAI" };
  }
};

export const generateImage = async (config: GenerationConfig): Promise<string> => {
  const styleKeywords = {
    [Style.MINIMAL]: "clean, minimalist, simple colors, negative space",
    [Style.AESTHETIC]: "soft focus, beautiful bokeh, trendy, cinematic lighting",
    [Style.DARK]: "moody, dark tones, shadows, dramatic, elegant black and gold",
    [Style.BRIGHT]: "high key, airy, sunlight, vibrant colors, uplifting"
  };

  const categoryContext = {
    [Category.SUCCESS]: "mountain peaks, golden sunrise, success icons, horizons",
    [Category.STUDY]: "organized desk, coffee, books, library, focused atmosphere",
    [Category.FITNESS]: "running path, athlete at dawn, nature workout, sweat and motion",
    [Category.SELF_CONFIDENCE]: "staring into distance, calm ocean, reflection, internal strength",
    [Category.MENTAL_WELLNESS]: "forest bathing, morning mist, zen gardens, tranquil waters"
  };

  const prompt = `A high-quality background image for a motivational quote. 
  Theme: ${categoryContext[config.category]}. 
  Style: ${styleKeywords[config.style]}. 
  The image should be abstract or atmospheric, leaving space for text overlay. 
  High resolution, cinematic.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: prompt,
    config: {
      imageConfig: {
        aspectRatio: config.aspectRatio as any,
      }
    }
  });

  let base64 = '';
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      base64 = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  if (!base64) {
    // Fallback image if generation fails
    return `https://picsum.photos/1080/1080?random=${Math.random()}`;
  }

  return base64;
};
