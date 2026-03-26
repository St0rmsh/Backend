import {tavily as Tavily} from "@tavily/core"
import config from "../config/config.js"

const tavily = Tavily({
    apiKey:config.TAVILY_API_KEY
})


export async function searchInternet({ query }) {
    try {
        const result = await tavily.search(query, {
            max_results: 8,              // 🔥 more coverage
            search_depth: "advanced",   // 🔥 deeper results
            include_answer: true        // 🔥 summary from Tavily
        });

        console.log("Search results:", result.results.length);

        // 🎯 filter + clean
        const cleaned = result.results
            .filter(item => item.url) // remove broken links
            .map(item => {
                let domain = "unknown";

                try {
                    domain = new URL(item.url).hostname;
                } catch {}

                return {
                    title: item.title,
                    snippet: item.content
                        ? item.content.slice(0, 400) // 🔥 bigger context
                        : "",
                    url: item.url,
                    source: domain,

                    // 🔥 trust hint (VERY IMPORTANT)
                    isTrusted:
                        domain.includes(".gov") ||
                        domain.includes(".edu") ||
                        domain.includes("wikipedia") ||
                        domain.includes("bbc") ||
                        domain.includes("reuters") ||
                        domain.includes("nature") ||
                        domain.includes("science")
                };
            });

        return {
            answer: result.answer || "",  // 🔥 quick summary
            results: cleaned
        };

    } catch (error) {
        console.log("Search error:", error.message);
        return { answer: "", results: [] };
    }
}
