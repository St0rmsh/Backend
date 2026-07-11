import { tavily as Tavily } from "@tavily/core";
import config from "../config/config.js";
import type { TavilyResponse, TavilyResult } from "../Types/tavily.types.js";

// BUG FIX: instantiating the client at import time with an empty API key used to throw
// as soon as the module loaded if TAVILY_API_KEY was unset. Guard it so the rest of the
// app (which doesn't strictly need Tavily) still boots.
const tavily = config.TAVILY_API_KEY ? Tavily({ apiKey: config.TAVILY_API_KEY }) : null;

type TavilyRawResponse = {
  answer: string;
  results: TavilyResult[];
  images?: string[];
};

export const searchInternet = async (query: string): Promise<TavilyResponse> => {
  if (!tavily) {
    // Feature is optional — degrade gracefully instead of throwing.
    return { answer: "", results: [], images: [] };
  }

  try {
    const res = (await tavily.search(query, {
      searchDepth: "advanced",
      maxResults: 5,
      includeAnswer: true,
    })) as TavilyRawResponse;

    return {
      answer: res.answer ?? "",
      results: res.results ?? [],
      images: res.images ?? [],
    };
  } catch (error: unknown) {
    console.error("Tavily search failed:", error);
    // NEW: don't let a search-provider outage take down the whole graph run.
    return { answer: "", results: [], images: [] };
  }
};