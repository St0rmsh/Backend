import { tavily as Tavily } from "@tavily/core";
import config from "../config/config.js";
import type { TavilyResponse } from "../types/tavily.types.js";

const tavily = Tavily({
    apiKey: config.TAVILY_API_KEY,
});

export const searchInternet = async (query: string): Promise<TavilyResponse> => {
    try {
        const res = await tavily.search(query, {
            searchDepth: "advanced",
            maxResults: 5,
            includeAnswer: true,
        });

        return {
            answer: res.answer ?? "",
            results: (res.results ?? []).map((r) => ({
                title: r.title,
                url: r.url,
                content: r.content,
                score: r.score,
            })),
            images: (res.images ?? []).map((img) => img.url),
        };
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error("Unknown error");
        throw new Error(err.message);
    }
};