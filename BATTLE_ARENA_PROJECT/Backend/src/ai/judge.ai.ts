import { z } from "zod";

import { GoogleAI } from "./model.ai.js";
import { judgePrompt } from "./prompts.ai.js";

import type {
  JudgeResult,
  Solution,
} from "../types/battle.types.js";

/* ============================================================
   Judge Schema
============================================================ */

const JudgeSchema = z.object({
  winner: z.enum([
    "solution_1",
    "solution_2",
  ]),

  scoreA: z.number(),

  scoreB: z.number(),

  reasoningA: z.string(),

  reasoningB: z.string(),

  verdict: z.string(),

  betterFor: z.string(),
});

/* ============================================================
   Judge Solutions
============================================================ */

export async function judgeSolutions(
  problem: string,
  solutionA: Solution,
  solutionB: Solution
): Promise<JudgeResult> {

  const prompt = judgePrompt(
    problem,
    solutionA.code,
    solutionB.code
  );

  const response =
    await GoogleAI
      .withStructuredOutput(JudgeSchema)
      .invoke(prompt);

  return {
    winner: response.winner,

    scoreA: response.scoreA,

    scoreB: response.scoreB,

    reasoningA: response.reasoningA,

    reasoningB: response.reasoningB,

    verdict: response.verdict,

    betterFor: response.betterFor,
  };
}