import { GoogleGenAI, Type } from "@google/genai";
import { BudgetPlan, StudyPlan } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStudyPlan = async (subjectTitle: string, subjectDescription: string): Promise<StudyPlan> => {
    try {
        const prompt = `As an expert academic advisor, create a detailed, focused, and structured one-month study plan for a student taking a course on '${subjectTitle}'. 
        Course Description: "${subjectDescription}".
        The plan should be broken down into weekly goals. For each week, list key topics, suggest specific learning activities (e.g., 'Read chapter X', 'Practice problem sets on Y'), recommend learning methods, and provide practical revision strategies.
        The output must be well-structured, easy to read, and actionable. Also, provide links to high-quality, relevant online resources that can aid in learning.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
            }
        });

        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
            ?.map(chunk => chunk.web)
            .filter(web => web?.uri && web.title) ?? [];

        return {
            plan: response.text,
            sources: sources as { uri: string; title: string }[],
        };
    } catch (error) {
        console.error("Error generating study plan:", error);
        throw new Error("Failed to generate study plan. Please check your API key and try again.");
    }
};

export const generateBudgetPlan = async (income: number, expenses: { category: string; amount: number }[]): Promise<BudgetPlan> => {
    try {
        const expenseString = expenses.map(e => `${e.category}: $${e.amount}`).join(', ');
        const prompt = `I am a student with a monthly income of $${income}. My fixed monthly expenses are: ${expenseString}. Please create a personalized budget plan for me. Provide a breakdown of spending categories, and offer practical, student-focused savings tips.`;

        const schema = {
            type: Type.OBJECT,
            properties: {
                summary: {
                    type: Type.STRING,
                    description: "A brief, encouraging summary of the budget plan."
                },
                breakdown: {
                    type: Type.ARRAY,
                    description: "A list of budget categories with their percentage and allocated amount.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            category: { type: Type.STRING, description: "Name of the budget category (e.g., 'Housing', 'Food', 'Savings')." },
                            percentage: { type: Type.NUMBER, description: "The percentage of the total income allocated to this category." },
                            amount: { type: Type.NUMBER, description: "The dollar amount allocated to this category." },
                        },
                        required: ["category", "percentage", "amount"],
                    },
                },
                tips: {
                    type: Type.ARRAY,
                    description: "A list of actionable financial tips for students.",
                    items: { type: Type.STRING },
                },
            },
            required: ["summary", "breakdown", "tips"],
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                systemInstruction: "You are a friendly and pragmatic financial advisor for students. Your goal is to provide clear, actionable budgeting advice that is realistic and encouraging.",
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as BudgetPlan;
    // FIX: Added missing closing curly brace for the try block.
    } catch (error) {
        console.error("Error generating budget plan:", error);
        throw new Error("Failed to generate budget plan. Please ensure your inputs are correct and try again.");
    }
};
