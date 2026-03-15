import dotenv from "dotenv/config";
import readline from "readline/promises";
import {ChatMistralAI} from "@langchain/mistralai"
import {HumanMessage , tool, createAgent,SystemMessage} from "langchain"
import {sendEmail} from "./email.service.js"
import * as z from "zod"
import {tavily} from "@tavily/core"



const tavilyClient = tavily({
    apiKey:process.env.TAVILY_API_KEY
}) 


const tavilyTool = tool(
    async ({query})=>{
         try {
      const response = await tavilyClient.search(query,{
        max_results: 3
      })

      console.log("Tavily response:", JSON.stringify(response, null, 2))

      const results = response?.results || []

      if (results.length === 0) {
        return "No search results found."
      }

      return results
        .map(
          (r) => `Title: ${r.title}
URL: ${r.url}
Content: ${r.content}`
        )
        .join("\n\n")

    } catch (error) {
      console.error("Tavily tool error:", error)
      return "Search tool failed."
    }


    },
    {
    name:"tavily_search",
    description:"Use this tool to search the web using Tavily API.",
    schema: z.object({
        query:z.string().describe("Search query to be sent to Tavily API")
    })
    }
)


// Color codes
const colors = {
  user: "\x1b[36m",      // Cyan for user
  ai: "\x1b[32m",        // Green for AI
  reset: "\x1b[0m"       // Reset color
};


const emailTool = tool(
    
    sendEmail,
    {

    name:"send_email",
    description:"Use this tool to send email.",

    schema: z.object({
        to:z.string().describe("Recipient's email address"),
        html:z.string().describe("HTML content of the email"),
        subject:z.string().describe("Subject of the email")

    
    })

    }
)

const rl = readline.createInterface({
     input: process.stdin,
     output: process.stdout 
    });



    const model = new ChatMistralAI({
        model: "mistral-small-latest",

    })


    const agent = createAgent({
        model,
        tools:[emailTool,tavilyTool]
    })

    const Chats =  [
  new SystemMessage(`
You are an AI assistant with internet access.

Use tavily_search whenever the user asks about:
- news
- current events
- latest updates
- unknown information
`)
]


 

    while (true) {
        
        const userInput = await rl.question(`${colors.user}You:${colors.reset} `)

        Chats.push(new HumanMessage(userInput))


        const response = await agent.invoke({messages:Chats})
        
        Chats.push(response.messages[response.messages.length - 1])

        const aiMessage = response.messages.at(-1)
        console.log(`${colors.ai}AI:${colors.reset} ${aiMessage.content}`)

        

        // console.log(response.messages[response.messages.length - 1].text);
        

        // console.log(`${colors.ai}AI: ${response.messages[response.messages.length - 1].content}${colors.reset}`);
        
    }

    rl.close()
