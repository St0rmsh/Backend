import { GoogleAI } from "./model.ai.js";
import { summaryPrompt } from "./prompts.ai.js";

import type {
  JudgeResult,
  Summary,
} from "../types/battle.types.js";

/* ============================================================
   Generate Summary
============================================================ */

export async function generateSummary(
  problem: string,
  judge: JudgeResult
): Promise<Summary> {
  const prompt = summaryPrompt(
    problem,
    JSON.stringify(judge, null, 2)
  );

  const response = await GoogleAI.invoke(prompt);

  let text = "";

  if (typeof response.content === "string") {
    text = response.content;
  } else if (Array.isArray(response.content)) {
    text = response.content
      .map((item) => {
        if (typeof item === "string") return item;

        if ("text" in item) {
          return item.text;
        }

        return "";
      })
      .join("\n");
  } else {
    text = String(response.content);
  }

  return {
    short: judge.verdict,
    detailed: text.trim(),
  };
}

export default generateSummary;