import { tavily as Tavily } from "@tavily/core";
import config from "../config/config.js";
import type { TavilyResponse, TavilyResult } from "../Types/Tavily.Types.js"

const tavily = Tavily({
  apiKey: config.TAVILY_API_KEY,
});


type TavilyRawResponse = {
  answer: string;
  results: TavilyResult[];
  images?: string[];
};

export const searchInternet = async (query: string): Promise<TavilyResponse> => {
  try {
    const res = await tavily.search({
      query,
      searchDepth: "advanced",
      maxResults: 5,
      includeAnswer: true,
    }) as TavilyRawResponse;

    return {
      answer: res.answer ?? "",
      results: res.results ?? [],
      images: res.images ?? [],
    };
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    throw new Error(err.message);
  }
};

