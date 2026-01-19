
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Difficulty, MathOperation, MathProblem } from "../types";

const API_KEY = process.env.API_KEY || '';

export const generateMathProblems = async (
  difficulty: Difficulty,
  operation: MathOperation,
  count: number = 5
): Promise<MathProblem[]> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate ${count} math ${operation} problems for a child at ${difficulty} level. Return a JSON array of objects with id, question (string like "12 + 5"), answer (number), and 4 options (array of numbers including the correct one).`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            answer: { type: Type.NUMBER },
            options: {
              type: Type.ARRAY,
              items: { type: Type.NUMBER }
            }
          },
          required: ['id', 'question', 'answer', 'options']
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Failed to parse math problems", e);
    return [];
  }
};

export const getTutorExplanation = async (problem: string, userAnswer?: number): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const prompt = userAnswer 
    ? `The student answered ${userAnswer} to "${problem}". Explain why that might be wrong or right, and show the step-by-step logic in a very friendly, encouraging way for a child.`
    : `Explain how to solve "${problem}" step-by-step for a child. Use emojis and simple language.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
        systemInstruction: "You are 'Giddy the Math Genie', a magical, encouraging, and super-friendly math tutor for kids. Use simple analogies, emojis, and lots of encouragement. Keep explanations brief but clear."
    }
  });

  return response.text || "I'm having a little trouble thinking right now. Let's try again!";
};

export const askGeneralTutorQuestion = async (question: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: question,
    config: {
        systemInstruction: "You are 'Giddy the Math Genie'. Answer math questions for children under 12. Be magical, helpful, and use simple terms. If the question isn't about math, politely steer them back to math magic!"
    }
  });
  return response.text || "That's a great question! Let me think about it more.";
};

export const generateEncouragementSpeech = async (text: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
        return base64Audio;
    }
  } catch (error) {
    console.error("Speech generation failed", error);
  }
  return null;
};
