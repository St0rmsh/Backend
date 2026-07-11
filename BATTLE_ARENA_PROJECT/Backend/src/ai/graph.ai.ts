import { performance } from "node:perf_hooks";

import { performResearch } from "./research.ai.js";
import { generateSolutions } from "./solution.ai.js";
import { judgeSolutions } from "./judge.ai.js";
import { generateSummary } from "./summary.ai.js";

import type {
  BattleResponse,
} from "../types/battle.types.js";

/* ============================================================
   Battle Arena Pipeline
============================================================ */

export async function runBattleArena(
  problem: string
): Promise<BattleResponse & { executionTime: number }> {

  const start = performance.now();

  /* --------------------------------------------------------
      STEP 1
      Internet Research
  -------------------------------------------------------- */

  const {
    research,
    context,
  } = await performResearch(problem);

  /* --------------------------------------------------------
      STEP 2
      Generate Solutions
  -------------------------------------------------------- */

  const {
    solutionA,
    solutionB,
  } = await generateSolutions(
    problem,
    context
  );

  /* --------------------------------------------------------
      STEP 3
      Judge Solutions
  -------------------------------------------------------- */

  const judgement = await judgeSolutions(
    problem,
    solutionA,
    solutionB
  );

  /* --------------------------------------------------------
      STEP 4
      Generate Final Summary
  -------------------------------------------------------- */

  const summary = await generateSummary(
    problem,
    judgement
  );

  const end = performance.now();

  return {
    problem,

    research,

    solutionA,

    solutionB,

    judgement,

    summary,

    executionTime: Number(
      (end - start).toFixed(2)
    ),
  };
}

export default runBattleArena;