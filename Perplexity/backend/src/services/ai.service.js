import { HumanMessage ,SystemMessage,AIMessage} from "@langchain/core/messages";
import {tool,createAgent} from "langchain"
import {ChatGoogleGenerativeAI} from "@langchain/google-genai"
import {ChatMistralAI} from "@langchain/mistralai"
import { searchInternet } from "./internet.service.js";
import * as z from "zod"


const GeminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
});


const MistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey:process.env.MISTRAL_API_KEY
})


const searchInternetTool = tool(
  searchInternet,
  {
    name: "searchInternet",
    description: "Use this tool to fetch the latest information from the internet.",
    schema: z.object({
      query: z.string().describe("The search query to look up on the internet.")
    })
  }
)


const agent = createAgent({
  model: MistralModel,
  tools:[searchInternetTool],
  toolChoice: "auto"
})


function normalizeContent(content) {
  if (typeof content === "string") return content;

  if (Array.isArray(content)) {
    return content.map(c => c.text || "").join("");
  }

  if (typeof content === "object") {
    return JSON.stringify(content);
  }

  return String(content);
}

export async function generateResponse(messages) {
  const formattedMessages = [
    new SystemMessage(`You are a helpful AI assistant.

Use previous messages for context.

You have access to a tool called "searchInternet" to fetch latest information from the web.

You MUST call the tool in the following cases:
- If the user asks about updates, new features, releases, or recent changes (e.g., React updates, Node.js updates)
- If the query may have changed after your training data
- If the user asks anything that could benefit from up-to-date or real-time information

DO NOT answer from memory in these cases.
Always call the tool first, then answer based on tool results.
`),
    ...messages
      .map((msg) => {
        if (msg.role === "user") return new HumanMessage(msg.content);
        if (msg.role === "assistant") return new AIMessage(msg.content);
        return null;
      })
      .filter(Boolean)
  ];

    try {
    const response = await agent.invoke({ messages: formattedMessages });

    if (response?.messages?.length) {
      const lastMessage = response.messages.at(-1);
      return normalizeContent(lastMessage.content);
    }

    return "No response from agent";

  } catch (error) {
    console.error("Gemini failed:", error.message);

      console.error("Mistral also failed:", err.message);
      return "AI is currently unavailable.";
    
  }
}






export async function generateChatTitle(message) {

  const response = await MistralModel.invoke([
    new SystemMessage(`You are a helpful assistant for a chat application. Your task is to generate a concise and descriptive title for a chat conversation.
    
    User will Provide a message from the chat conversation, and you need to generate a title that captures the essence of the conversation in a few words.The title should be relevant to the content of the message and should give a clear idea of what the conversation is about. Please provide only the title without any additional text or explanation.a

    `),
    new HumanMessage(`Generate a title for the following message: ${message}`)
  ])


  return response.text || response.content || "New Chat";
}


