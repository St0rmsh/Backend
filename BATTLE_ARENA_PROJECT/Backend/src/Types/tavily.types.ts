/**
 * Single search result returned by Tavily
 */
export interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

/**
 * Image returned by Tavily
 */
export interface TavilyImage {
  url: string;
  description?: string;
}

/**
 * Main response from Tavily Service
 */
export interface TavilyResponse {
  answer: string;
  results: TavilyResult[];
  images: TavilyImage[];
}