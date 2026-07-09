import { tavily } from "@tavily/core";

import config from "../config/config.js";

import type {
  TavilyImage,
  TavilyResult,
  TavilyResponse,
} from "../types/tavily.types.js";

/* ============================================================
   Tavily Client
============================================================ */

const client = tavily({
  apiKey: config.TAVILY_API_KEY,
});

/* ============================================================
   Search Internet
============================================================ */

export async function searchInternet(
  query: string
): Promise<TavilyResponse> {
  try {
    const response = await client.search(query, {
      searchDepth: "advanced",

      maxResults: 5,

      includeAnswer: true,

      includeImages: true,
    });

    const results: TavilyResult[] = [];

    for (const item of response.results ?? []) {
      results.push({
        title: item.title,
        url: item.url,
        content: item.content,
        score: item.score,
      });
    }

    const images: TavilyImage[] = [];

    for (const image of response.images ?? []) {
      images.push({
        url: image.url,
        ...(image.description
          ? { description: image.description }
          : {}),
      });
    }

    return {
      answer: response.answer ?? "",

      results,

      images,
    };
  } catch (error) {
    console.error("\n❌ Tavily Search Error\n");

    console.error(error);

    return {
      answer: "",

      results: [],

      images: [],
    };
  }
}

/* ============================================================
   Helper
============================================================ */

export async function researchToMarkdown(
  question: string
): Promise<string> {
  const research = await searchInternet(question);

  let markdown = "";

  markdown += `# Internet Research\n\n`;

  markdown += `## Summary\n\n`;

  markdown += `${research.answer}\n\n`;

  markdown += `## Sources\n\n`;

  for (const source of research.results) {
    markdown += `### ${source.title}\n`;

    markdown += `${source.content}\n`;

    markdown += `${source.url}\n\n`;
  }

  return markdown;
}





export function buildResearchContext(
  research: TavilyResponse
): string {

  return [
    research.answer,

    ...research.results.map(
      r =>
        `${r.title}\n${r.content}`
    )

  ].join("\n\n");
}