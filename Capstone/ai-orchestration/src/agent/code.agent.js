import dotenv from "dotenv";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatAnthropic } from "@langchain/anthropic";
import {listFiles,updateFile,readFile,createFile} from "./tools.js"
import { createAgent } from "langchain";

dotenv.config();

const mistralModel = new ChatMistralAI({
    apiKey: process.env.MISTRALAI_API_KEY,
    model: "mistral-small-latest",
    temperature: 0.7,
});

const geminiModel = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-2.0-flash",
    temperature: 0.7,
});

const claudeModel = new ChatAnthropic({
    apiKey: process.env.CLAUDE_API_KEY,
    model: "claude-3-5-sonnet-latest",
    temperature: 0.7,
});


const agent = createAgent({
    model: mistralModel,
    tools: [listFiles, updateFile, readFile, createFile],
})


await agent.invoke({
   messages:[
    {
        role: "user",
        content: "update The Theme of the project to light ",
    }
   ]
})