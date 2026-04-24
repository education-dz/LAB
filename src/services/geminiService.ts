import { GoogleGenAI, Type } from "@google/genai";

export interface ChemicalIntelligence {
  nameEn: string;
  nameAr: string;
  formula: string;
  casNumber: string;
  storageTemp: string;
  hazardClass: 'safe' | 'danger';
  ghs: string[];
  expiryYears: number;
  notes: string;
}

export async function ensureApiKey(): Promise<boolean> {
  if (process.env.API_KEY || process.env.GEMINI_API_KEY) return true;
  
  if (typeof window !== 'undefined' && (window as any).aistudio?.openSelectKey) {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
      // After selecting, check again
      return await (window as any).aistudio.hasSelectedApiKey();
    }
    return true;
  }
  return false;
}

export async function getChemicalIntelligence(name: string, retries = 5, delay = 3000): Promise<ChemicalIntelligence | null> {
  try {
    const hasKey = await ensureApiKey();
    if (!hasKey) {
      console.error("No API key available for Gemini.");
      return null;
    }

    // Initialize GoogleGenAI inside the function to ensure the most up-to-date API key is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY || '' });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide detailed chemical information for: "${name}". 
      Return the data in JSON format with the following fields:
      - nameEn: English name
      - nameAr: Arabic name
      - formula: Chemical formula
      - casNumber: CAS registry number
      - storageTemp: Recommended storage temperature (e.g. "2-8°C", "Room Temp")
      - hazardClass: either 'safe' or 'danger'
      - ghs: array of GHS codes (e.g. ["GHS01", "GHS02"])
      - expiryYears: typical shelf life in years as a number
      - notes: brief safety and storage notes in Arabic`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nameEn: { type: Type.STRING },
            nameAr: { type: Type.STRING },
            formula: { type: Type.STRING },
            casNumber: { type: Type.STRING },
            storageTemp: { type: Type.STRING },
            hazardClass: { type: Type.STRING, enum: ['safe', 'danger'] },
            ghs: { type: Type.ARRAY, items: { type: Type.STRING } },
            expiryYears: { type: Type.NUMBER },
            notes: { type: Type.STRING },
          },
          required: ["nameEn", "nameAr", "formula", "casNumber", "storageTemp", "hazardClass", "ghs", "expiryYears", "notes"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text.trim()) as ChemicalIntelligence;
  } catch (error: any) {
    const errorMessage = error?.message || String(error);
    const isQuotaExceeded = errorMessage.includes("quota") || errorMessage.includes("RESOURCE_EXHAUSTED");
    
    // Handle rate limit (429) errors with exponential backoff
    if (error?.status === 'RESOURCE_EXHAUSTED' || error?.code === 429 || isQuotaExceeded) {
      // If it's a hard quota limit (daily/monthly), retrying won't help immediately
      if (errorMessage.includes("check your plan and billing details") || errorMessage.includes("Hard quota limit reached")) {
        console.error("Hard quota limit reached. Please check your Gemini API billing/plan.");
        
        // If the user hasn't selected their own key, prompt them to do so
        if (typeof window !== 'undefined' && (window as any).aistudio?.openSelectKey) {
          const hasKey = await (window as any).aistudio.hasSelectedApiKey();
          if (!hasKey) {
            console.warn("Prompting user to select their own API key due to quota exhaustion.");
            await (window as any).aistudio.openSelectKey();
            // After selecting a key, we can try one more time
            return getChemicalIntelligence(name, 1, delay);
          }
        }
        return null;
      }

      if (retries > 0) {
        console.warn(`Rate limit hit for "${name}". Retrying in ${delay}ms... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return getChemicalIntelligence(name, retries - 1, delay * 1.5);
      }
    }
    
    console.error("Error fetching chemical intelligence:", error);
    return null;
  }
}

export interface StorageAnalysisResult {
  storageZones: {
    zoneName: string;
    colorCode: string;
    recommendedChemicals: string[];
    description: string;
  }[];
  hazards: {
    severity: 'high' | 'medium' | 'low';
    location: string;
    chemicalsInvolved: string[];
    reason: string;
  }[];
  overallSafetyGrade: string;
}

export async function analyzeChemicalStorage(inventory: any[], retries = 3, delay = 5000): Promise<StorageAnalysisResult | null> {
  try {
    const hasKey = await ensureApiKey();
    if (!hasKey) return null;

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY || '' });
    
    // Format the inventory slightly to save tokens
    const compactInventory = inventory.map(c => ({
      nameEn: c.nameEn,
      nameAr: c.nameAr,
      hazardClass: c.hazardClass,
      ghs: c.ghs,
      shelf: c.shelf || "Unassigned"
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an expert in chemical laboratory safety and storage matrices. 
      Analyze the provided laboratory chemical inventory and its current physical shelf locations.
      
      1. Group the chemicals into ideal "Storage Zones" (e.g., Acids, Flammables, Oxidizers, Bases, General).
      2. Analyze their CURRENT "shelf" locations. Identify any dangerous incompatibilities (e.g., storing an oxidizer with a flammable on the same shelf, or an acid with a base).
      3. Return a safety grade (A, B, C, D, F).
      
      Inventory Data: ${JSON.stringify(compactInventory)}
      
      Return Arabic translated descriptions for the zones and hazard reasons where applicable.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            storageZones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  zoneName: { type: Type.STRING },
                  colorCode: { type: Type.STRING },
                  recommendedChemicals: { type: Type.ARRAY, items: { type: Type.STRING } },
                  description: { type: Type.STRING }
                },
                required: ["zoneName", "colorCode", "recommendedChemicals", "description"]
              }
            },
            hazards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  severity: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
                  location: { type: Type.STRING },
                  chemicalsInvolved: { type: Type.ARRAY, items: { type: Type.STRING } },
                  reason: { type: Type.STRING }
                },
                required: ["severity", "location", "chemicalsInvolved", "reason"]
              }
            },
            overallSafetyGrade: { type: Type.STRING }
          },
          required: ["storageZones", "hazards", "overallSafetyGrade"]
        }
      }
    });

    if (!response.text) return null;
    return JSON.parse(response.text.trim()) as StorageAnalysisResult;
  } catch (error: any) {
    if ((error?.status === 'RESOURCE_EXHAUSTED' || error?.code === 429) && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return analyzeChemicalStorage(inventory, retries - 1, delay * 1.5);
    }
    console.error("Error analyzing chemical storage:", error);
    return null;
  }
}

export interface EquipmentIntelligence {
  id: string;
  smartNameAr: string;
  smartDescriptionAr: string;
  imageKeyword: string;
}

export async function getEquipmentIntelligence(items: { id: string; name: string }[], retries = 3, delay = 5000): Promise<EquipmentIntelligence[] | null> {
  try {
    const hasKey = await ensureApiKey();
    if (!hasKey) return null;

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY || '' });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze these laboratory equipment items and provide: 
      1. A better Arabic name (smartNameAr).
      2. A concise Arabic description (smartDescriptionAr).
      3. An English keyword for image search (imageKeyword).
      Items: ${JSON.stringify(items)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              smartNameAr: { type: Type.STRING },
              smartDescriptionAr: { type: Type.STRING },
              imageKeyword: { type: Type.STRING }
            },
            required: ["id", "smartNameAr", "smartDescriptionAr", "imageKeyword"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (err: any) {
    const errorMessage = err.message || String(err);
    if (errorMessage.includes("429") || errorMessage.includes("quota") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
      if (retries > 0) {
        console.warn(`Quota exceeded for equipment. Retrying in ${delay/1000}s...`);
        await new Promise(r => setTimeout(r, delay));
        return getEquipmentIntelligence(items, retries - 1, delay * 2);
      }
      
      if (errorMessage.includes("check your plan and billing details") || errorMessage.includes("Hard quota limit reached")) {
        if (typeof window !== 'undefined' && (window as any).aistudio?.openSelectKey) {
          const hasKey = await (window as any).aistudio.hasSelectedApiKey();
          if (!hasKey) {
            await (window as any).aistudio.openSelectKey();
            return getEquipmentIntelligence(items, 1, delay);
          }
        }
      }
    }
    console.error("Error fetching equipment intelligence:", err);
    return null;
  }
}
