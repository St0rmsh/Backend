import { ChatMistralAI } from "@langchain/mistralai";
import { ChatCohere } from "@langchain/cohere";
import { ChatGoogle } from "@langchain/google";
import config from "../config/config.js";

export const GoogleAI = new ChatGoogle({
  model: "gemini-flash-latest",
  apiKey: config.GOOGLE_API_KEY,
  temperature: 0.2, // NEW: judge should be consistent, not creative
});

export const MistralAI : ChatMistralAI = new ChatMistralAI({
  model: "mistral-medium-latest",
  apiKey: config.MISTRAL_API_KEY,
  temperature: 0.7,
});

export const CohereAI : ChatCohere = new ChatCohere({
  model: "command-a-03-2025",
  apiKey: config.COHERE_API_KEY,
  temperature: 0.7,
});