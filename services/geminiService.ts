
import { GoogleGenAI, Type } from "@google/genai";
import { Report, PredictionResult, DiseaseType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeOutbreakRisk = async (reports: Report[]): Promise<PredictionResult> => {
  const reportsContext = reports.map(r => 
    `- ${r.diseaseType} in ${r.location.region} (${r.species}) with severity ${r.severity}`
  ).join('\n');

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze the following zoonotic disease reports and predict the risk of an outbreak in India:
    
    ${reportsContext}
    
    Provide your analysis in a structured JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: { type: Type.NUMBER, description: 'Risk score from 0-100' },
          explanation: { type: Type.STRING },
          recommendations: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          affectedRegions: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          }
        },
        required: ['riskScore', 'explanation', 'recommendations', 'affectedRegions']
      }
    }
  });

  const jsonStr = response.text || '{}';
  return JSON.parse(jsonStr);
};

export const getLatestDiseaseAlerts = async () => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: "What are the latest zoonotic disease outbreaks or alerts globally and specifically in India for 2024-2025?",
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => chunk.web).filter(Boolean) || []
  };
};

export const startAssistantChat = () => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are the SYNAPSE AI Medical Assistant. Keep answers concise and actionable.'
    }
  });
};

/**
 * Crisis Room Vision & Text Chat
 * Processes multi-modal input (text + images)
 */
export const analyzeFieldImage = async (prompt: string, base64Image?: string, mimeType?: string) => {
  const parts: any[] = [{ text: prompt }];
  
  if (base64Image && mimeType) {
    parts.push({
      inlineData: {
        data: base64Image,
        mimeType: mimeType
      }
    });
  }

  return ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    contents: [{ parts }],
    config: {
      systemInstruction: 'You are an elite One Health Epidemiologist in the SYNAPSE Crisis Room. Analyze text and images of symptoms, animal behavior, or environmental data to identify potential zoonotic risks. Always provide a disclaimer that this is AI-assisted triage and requires clinical confirmation.'
    }
  });
};
