import {tavily as Tavily} from "@tavily/core"



const tavily = Tavily({
    apiKey:process.env.TAVILY_API_KEY,
})


export const searchInternet = async({query})=>{

    const result = await tavily.search(query, {
        maxResults:6,
    })

    console.log(JSON.stringify(result));

  return result.results
    .map(
      (r, i) =>
        `[${i + 1}] ${r.title}\n${r.content}\nSource: ${r.url}`
    )
    .join("\n\n");
    
}