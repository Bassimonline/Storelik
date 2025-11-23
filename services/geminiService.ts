import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a product description and potentially an image using Gemini.
 */
export const generateProductDetails = async (
  productName: string,
  category: string,
  tone: string,
  language: string = 'English'
): Promise<{ description: string; imageBase64: string | null }> => {
  try {
    // 1. Generate Text Description
    const textResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Act as a professional copywriter. Write a compelling, high-converting product description for a "${productName}" in the "${category}" category. 
      Tone: ${tone}. 
      Language: ${language}.
      Keep it between 50-80 words. Focus on benefits and solving a problem. Return ONLY the description text.`,
    });
    
    const description = textResponse.text?.trim() || "No description generated.";

    // 2. Generate Product Image
    const imagePrompt = `Professional product photography of ${productName}, ${category}, centered composition, studio lighting, high resolution, minimalist white background, commercial ecommerce style.`;
    
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
 * Generates marketing copy (Ads, Social Media).
 */
export const generateMarketingCopy = async (
  productName: string,
  platform: 'Facebook' | 'Instagram' | 'TikTok',
  language: string
) => {
  try {
    const prompt = `Write a viral, high-converting ${platform} ad copy for a product named "${productName}". 
    Language: ${language}.
    Include emojis, a hook, benefits, and a call to action. 
    For TikTok, keep it short and punchy. For Facebook, focus on the problem/solution.
    Return ONLY the ad copy.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini Marketing Gen Error:", error);
    throw error;
  }
};

/**
 * Generates SEO Metadata.
 */
export const generateSEOData = async (productName: string, description: string) => {
  try {
    const prompt = `Analyze this product: "${productName}" - "${description}".
    Generate a JSON object with:
    1. "metaTitle" (max 60 chars, catchy)
    2. "metaDescription" (max 160 chars, SEO optimized)
    3. "keywords" (comma separated string of 10 high volume keywords)
    
    Return ONLY the JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini SEO Gen Error:", error);
    return { metaTitle: "", metaDescription: "", keywords: "" };
  }
};

/**
 * Generates an order confirmation message template (e.g., for WhatsApp).
 */
export const generateOrderConfirmationTemplate = async (
  language: string,
  tone: string,
  shopName: string,
  agentName: string,
  confirmationPoints: string[]
): Promise<string> => {
  try {
    const prompt = `
      Act as a generic "Happy Salesman" AI Agent named ${agentName} for a store named ${shopName}.
      Write the FIRST message sent to a customer on WhatsApp immediately after they place a COD (Cash on Delivery) order.

      Settings:
      - Language: ${language}
      - Tone: ${tone} (Enthusiastic, Helpful, Professional)
      - Goal: Warmly welcome them and ask them to confirm these specific details: ${confirmationPoints.join(', ')}.
      
      Requirements:
      - Use WhatsApp formatting (asterisks for bold).
      - Use emojis.
      - Be very polite and energetic.
      - End with a question asking for confirmation.
      - Keep it under 60 words.
      
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
 * Analyzes a raw product name to suggest categories and price ranges.
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

/**
 * Generates comprehensive store branding based on a niche.
 */
export const generateStoreBranding = async (niche: string) => {
  try {
    const prompt = `
      You are an expert e-commerce brand consultant. 
      Create a brand identity for a store in the "${niche}" niche targeting the Moroccan market.
      
      Return a JSON object with:
      1. "storeName": A catchy, modern name (English or French).
      2. "heroHeadline": A powerful 3-5 word headline for the homepage.
      3. "heroSubtitle": A compelling 10-15 word subtitle.
      4. "suggestedThemeId": Choose one from ['modern', 'cosmetic', 'fitness', 'gaming', 'health', 'car', 'animals'].
      
      Return ONLY the JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Branding Error:", error);
    throw error;
  }
};

/**
 * Generates speech audio from text using Gemini TTS.
 */
export const generateSpeech = async (text: string, voice: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' = 'Puck'): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("Gemini TTS Error:", error);
    return null;
  }
};

/**
 * Handles a chat reply from the AI agent to the customer.
 */
export const replyToCustomer = async (
  history: { role: 'user' | 'model', text: string }[],
  userMessage: string,
  agentConfig: any
): Promise<string> => {
  try {
    const systemPrompt = `
      You are ${agentConfig.agentName}, a helpful AI support agent for a store.
      Language: ${agentConfig.language}.
      Tone: ${agentConfig.tone}.
      Context: You are handling a COD order confirmation on WhatsApp.
      Your goal is to confirm details like Name, City, Address, Quantity.
      Be concise, use emojis, and keep replies under 40 words.
    `;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemPrompt,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text || "Sorry, I didn't catch that.";
  } catch (error) {
    console.error("Chat Reply Error:", error);
    return "Thinking...";
  }
};