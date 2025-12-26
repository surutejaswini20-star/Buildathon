
import { GoogleGenAI, Type } from "@google/genai";

const AI_MODEL = "gemini-3-pro-preview";

export const geminiService = {
  improveResume: async (originalResume: string, jobDescription: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    const systemInstruction = `
      You are a world-class executive resume writer and career coach.
      Your goal is to rewrite a user's resume bullet points and professional summary to make them high-impact.
      
      RULES:
      1. Use POWER VERBS: Replace passive language (e.g., "was responsible for", "helped with") with strong action verbs (e.g., "Spearheaded", "Architected", "Optimized", "Engineered").
      2. QUANTIFY ACHIEVEMENTS: Include percentages, dollar amounts, or time-saved metrics where plausible. If the user didn't provide specific numbers, use placeholders like [X%] or [Significant Increase] so they know where to add them.
      3. FACTUAL ACCURACY: Do not hallucinate new jobs, degrees, or companies. Improve the phrasing of existing facts.
      4. TAILORING: Align the keywords with the provided Job Description.
      5. FORMAT: Return the output in clean Markdown.
      6. COVER LETTER: Also generate a single, high-impact paragraph (approx 100-150 words) that connects the user's specific experience to the job requirements.

      RESPONSE FORMAT: You MUST return a JSON object with two keys:
      - "improvedResume": The full rewritten resume in Markdown.
      - "coverLetter": The 1-paragraph cover letter snippet.
    `;

    const prompt = `
      JOB DESCRIPTION:
      ${jobDescription}

      ORIGINAL RESUME:
      ${originalResume}
    `;

    try {
      const response = await ai.models.generateContent({
        model: AI_MODEL,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              improvedResume: { type: Type.STRING },
              coverLetter: { type: Type.STRING },
            },
            required: ["improvedResume", "coverLetter"]
          },
          temperature: 0.7,
        },
      });

      const result = JSON.parse(response.text || '{}');
      return result;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to process resume with AI. Please check your API key.");
    }
  }
};
