import {tavily as Tavily} from "@tavily/core"
import config from "../config/config.js"

const tavily = Tavily({
    apiKey:config.TAVILY_API_KEY
})


export async function searchInternet({query}) {
    try {
        
        const result = await tavily.search(query, {
            max_results:5
        })
console.log("Search results:", result.results.length);
        

       return result.results.map(item => ({
    title: item.title,
    snippet: item.content ? item.content.slice(0, 200) : "",
    url: item.url,
    source: (() => {
    try {
        return new URL(item.url).hostname;
    } catch {
        return "unknown";
    }
})()
}));

    } catch (error) {
        console.log("Error "+error);
        return []
        
    }
}