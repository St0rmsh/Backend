export interface Solution {
  model: string;

  code: string;

  explanation: string;

  complexity: string;

  strengths: string[];
}

export interface JudgeResult {
  winner: "solution_1" | "solution_2";

  scoreA: number;

  scoreB: number;

  reasoningA: string;

  reasoningB: string;

  verdict: string;

  betterFor: string;
}

export interface ResearchSource {
  title: string;

  url: string;
}

export interface ResearchResult {
  answer: string;

  sources: ResearchSource[];
}

export interface Summary {
  short: string;

  detailed: string;
}

export interface BattleResponse {
  problem: string;

  research: ResearchResult;

  solutionA: Solution;

  solutionB: Solution;

  judgement: JudgeResult;

  summary: Summary;
}