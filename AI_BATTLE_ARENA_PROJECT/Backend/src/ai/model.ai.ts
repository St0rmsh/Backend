import {ChatMistralAI} from "@langchain/mistralai";
import {ChatCohere} from "@langchain/cohere";
import {ChatGoogle} from "@langchain/google";
import config from "../config/config.js";





export const GoogleAI = new ChatGoogle({
     model: "gemini-flash-latest",
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