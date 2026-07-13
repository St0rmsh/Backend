export interface TavilyResult {
    title: string;
    url: string;
    content: string;
    score?: number;
}

export interface TavilyResponse {
    answer: string;
    results: TavilyResult[];
    images?: string[]; // we extract just the URLs, not the full TavilyImage objects
}