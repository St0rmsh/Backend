import { invokeModel } from "./model.ai.js";
import { solutionPrompt } from "./prompts.ai.js";

import type { Solution } from "../types/battle.types.js";

/* ============================================================
   Helper
============================================================ */




function parseMarkdown(response: string) {

  const explanation =
    response.match(/# Explanation([\s\S]*?)# Algorithm/i)?.[1]?.trim() ??
    "";

  const complexity =
    response.match(/# Complexity([\s\S]*?)# Code/i)?.[1]?.trim() ??
    "";

  const code =
    response.match(/```[\w]*\n([\s\S]*?)```/)?.[1]?.trim() ??
    response;

  return {
    explanation,
    complexity,
    code,
  };

}



function createSolution(model: string,response: string): Solution {

  const parsed = parseMarkdown(response);

  return {

    model,

    code: parsed.code,

    explanation: parsed.explanation,

    complexity: parsed.complexity,

    strengths: [],

  };

}

/* ============================================================
   Generate Solutions
============================================================ */

export async function generateSolutions(
  problem: string,
  research: string
): Promise<{
  solutionA: Solution;
  solutionB: Solution;
}> {

  const prompt = solutionPrompt(
    problem,
    research
  );

  const [mistral, cohere] = await Promise.all([

    invokeModel(
      "mistral",
      prompt
    ),

    invokeModel(
      "cohere",
      prompt
    ),

  ]);

  return {

    solutionA: createSolution(
      "Mistral",
      mistral
    ),

    solutionB: createSolution(
      "Cohere",
      cohere
    ),

  };

}