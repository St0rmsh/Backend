import { HumanMessage ,SystemMessage,AIMessage} from "@langchain/core/messages";
import {ChatGoogleGenerativeAI} from "@langchain/google-genai"
import {ChatMistralAI} from "@langchain/mistralai"


const GeminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
});


const MistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey:process.env.MISTRAL_API_KEY
})

export async function generateResponse(messages) {

    console.log(messages)
    
    const response = await GeminiModel.invoke(messages.map(msg => {
        if (msg.role == "user") {
            return new HumanMessage(msg.content)
        } else if (msg.role == "ai") {
            return new AIMessage(msg.content)
        }
    }));

    return response.text;

}


export async function generateChatTitle(message) {

  const response = await MistralModel.invoke([
    new SystemMessage(`You are a helpful assistant for a chat application. Your task is to generate a concise and descriptive title for a chat conversation.
    
    User will Provide a message from the chat conversation, and you need to generate a title that captures the essence of the conversation in a few words.The title should be relevant to the content of the message and should give a clear idea of what the conversation is about. Please provide only the title without any additional text or explanation.a

    `),
    new HumanMessage(`Generate a title for the following message: ${message}`)
  ])


  return response.text
}


