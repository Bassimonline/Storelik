import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a product description and potentially an image using Gemini.
 */
export const generateProductDetails = async (
  productName: string,
  category: string,
  tone: string
): Promise<{ description: string; imageBase64: string | null }> => {
  try {
    // We use the image model to attempt both text description and image generation in one go,
    // or we can chain them. For better quality, we will use separate calls effectively or a combined prompt if supported.
    // Strategy: Use gemini-2.5-flash-image for image generation and gemini-2.5-flash for text to ensure high quality text.

    // 1. Generate Text Description
    const textResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a compelling, sales-oriented product description for a "${productName}" in the "${category}" category. Tone: ${tone}. Keep it under 100 words. Return ONLY the description text.`,
    });
    
    const description = textResponse.text?.trim() || "No description generated.";

    // 2. Generate Product Image
    // Note: gemini-2.5-flash-image is capable of generation.
    const imagePrompt = `Professional product photography of ${productName}, ${category}, studio lighting, 4k resolution, minimalist background, commercial ecommerce style.`;
    
    const imageResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: imagePrompt }]
      }
    });

    let imageBase64: string | null = null;

    // Extract image from response
    if (imageResponse.candidates?.[0]?.content?.parts) {
      for (const part of imageResponse.candidates[0].content.parts) {
        if (part.inlineData) {
          imageBase64 = part.inlineData.data;
          break; // Found the image
        }
      }
    }

    return { description, imageBase64 };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * Generates an order confirmation message template (e.g., for WhatsApp).
 */
export const generateOrderConfirmationTemplate = async (
  language: string,
  tone: string,
  shopName: string
): Promise<string> => {
  try {
    const prompt = `
      Act as an e-commerce expert for the Moroccan market.
      Write a short, effective order confirmation message to be sent via WhatsApp or SMS.
      
      Details:
      - Shop Name: ${shopName}
      - Language: ${language}
      - Tone: ${tone}
      - Context: A customer just placed an order (Cash on Delivery).
      - Goal: Confirm the order and ask them to reply with "1" to confirm delivery.
      
      Return ONLY the message text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini Text Gen Error:", error);
    throw error;
  }
};

/**
 * Analyzes a raw product name to suggest categories and price ranges (Mock import helper).
 */
export const analyzeProductImport = async (rawText: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this product input: "${rawText}". Return a JSON object with keys: "suggestedName", "category", "estimatedPriceMAD" (number). Return ONLY JSON.`,
      config: {
        responseMimeType: 'application/json'
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { error: "Failed to analyze" };
  }
};