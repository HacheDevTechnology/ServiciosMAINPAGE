import { GoogleGenAI } from "@google/genai";
import { SystemConfig } from "../types";

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("API Key Missing. Set VITE_GEMINI_API_KEY in .env");
    }
    aiInstance = new GoogleGenAI({ apiKey: apiKey });
  }
  return aiInstance;
};

export const sendMessageToGemini = async (
  message: string,
  history: { role: string; text: string }[],
  config: SystemConfig
): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: config.model,
      contents: [
        ...history.map(h => ({
          role: h.role === 'model' ? 'model' : 'user',
          parts: [{ text: h.text }]
        })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: config.systemPrompt,
        temperature: config.temperature,
      }
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini Error:", error);
    return `[SYSTEM_FAILURE]: ${error instanceof Error ? error.message : "Unknown Connection Error"}`;
  }
};

export const generateAgentImage = async (prompt: string): Promise<string | null> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-001', // Using imagen-3 as it's the standard available public image model in GenAI SDK right now
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '9:16', // Vertical for the side bar
        outputMimeType: 'image/jpeg'
      }
    });

    const base64Str = response.generatedImages?.[0]?.image?.imageBytes;
    if (base64Str) {
      return `data:image/jpeg;base64,${base64Str}`;
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
};
