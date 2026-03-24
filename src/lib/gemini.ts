import { GoogleGenAI } from "@google/genai";



const api = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });


export async function main(FullContent: any) {
    const response = await api.models.generateContentStream({
        model: "gemini-2.5-flash-lite",
        contents: FullContent
    });

    return response;
}