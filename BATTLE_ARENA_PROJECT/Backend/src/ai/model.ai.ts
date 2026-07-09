import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatCohere } from "@langchain/cohere";

import config from "../config/config.js";

/* ============================================================
   Google Gemini
============================================================ */

export const GoogleAI = new ChatGoogleGenerativeAI({
  apiKey: config.GOOGLE_API_KEY,

  model: "gemini-2.5-flash",

  temperature: 0.2,

  maxRetries: 2,
});

/* ============================================================
   Mistral
============================================================ */

export const MistralAI = new ChatMistralAI({
  apiKey: config.MISTRAL_API_KEY,

  model: "mistral-medium-latest",

  temperature: 0.3,

  maxRetries: 2,
});

/* ============================================================
   Cohere
============================================================ */

export const CohereAI = new ChatCohere({
  apiKey: config.COHERE_API_KEY,

  model: "command-a-03-2025",

  temperature: 0.3,

  maxRetries: 2,
});

/* ============================================================
   All Models
============================================================ */

export const Models = {
  google: GoogleAI,

  mistral: MistralAI,

  cohere: CohereAI,
} as const;

export type ModelName = keyof typeof Models;

/* ============================================================
   Generic Model Invoker
============================================================ */

export async function invokeModel(
  model: ModelName,
  prompt: string
): Promise<string> {
  const response = await Models[model].invoke(prompt);

  if (typeof response.content === "string") {
    return response.content;
  }

  if (Array.isArray(response.content)) {
    return response.content
      .map((item) => {
        if (typeof item === "string") return item;

        if ("text" in item) {
          return item.text;
        }

        return "";
      })
      .join("\n");
  }

  return String(response.content);
}