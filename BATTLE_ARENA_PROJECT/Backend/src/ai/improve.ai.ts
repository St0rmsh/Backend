import { GoogleAI } from "./model.ai.js";
import { improvementPrompt } from "./prompts.ai.js";

/* ============================================================
   Improved Solution
============================================================ */

export interface ImprovedSolution {
  improvements: string[];
  code: string;
}

/* ============================================================
   Helpers
============================================================ */

function extractCode(markdown: string): string {
  const match = markdown.match(/```(?:\w+)?\n([\s\S]*?)```/);

  if (match?.[1]) {
    return match[1].trim();
  }

  return markdown;
}

function extractImprovements(markdown: string): string[] {
  const section = markdown.match(
    /# Improvements([\s\S]*?)# Improved Code/i
  );

  if (!section?.[1]) {
    return [];
  }

  return section[1]
    .split("\n")
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
}

function responseToText(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (
          typeof item === "object" &&
          item !== null &&
          "text" in item
        ) {
          return String(
            (item as { text: unknown }).text
          );
        }

        return "";
      })
      .join("\n");
  }

  return "";
}

/* ============================================================
   Improve Solution
============================================================ */

export async function improveSolution(
  code: string
): Promise<ImprovedSolution> {
  try {
    const prompt = improvementPrompt(code);

    const response = await GoogleAI.invoke(prompt);

    const markdown = responseToText(response.content);

    return {
      improvements: extractImprovements(markdown),

      code: extractCode(markdown),
    };
  } catch (error) {
    console.error("Improve AI Error:", error);

    return {
      improvements: [
        "AI improvement service unavailable."
      ],

      code,
    };
  }
}