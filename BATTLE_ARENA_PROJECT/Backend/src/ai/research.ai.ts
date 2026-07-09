import {buildResearchContext,searchInternet} from "../services/tavily.services.js";

import type {
  ResearchResult,
} from "../types/battle.types.js";

export async function performResearch(problem: string): Promise<{
  research: ResearchResult;
  context: string;
}> {
  const result = await searchInternet(problem);

  const context = buildResearchContext(result);

  return {
    research: {
      answer: result.answer,

      sources: result.results.map((item) => ({
        title: item.title,
        url: item.url,
      })),
    },

    context,
  };
}