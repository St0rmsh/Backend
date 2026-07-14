import { ChatMistralAI } from "@langchain/mistralai";
import { ChatCohere } from "@langchain/cohere";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import config from "../config/config.js";

export const GoogleAI = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: config.GOOGLE_API_KEY,
});

export const MistralAI = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: config.MISTRAL_API_KEY,
});

export const CohereAI = new ChatCohere({
    model: "command-a-03-2025",
    apiKey: config.COHERE_API_KEY,
});