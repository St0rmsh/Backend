import dotenv from "dotenv/config";
import readline from "readline/promises";
import {ChatMistralAI} from "@langchain/mistralai"
import {HumanMessage} from "langchain"

// Color codes
const colors = {
  user: "\x1b[36m",      // Cyan for user
  ai: "\x1b[32m",        // Green for AI
  reset: "\x1b[0m"       // Reset color
};

const rl = readline.createInterface({
     input: process.stdin,
     output: process.stdout 
    });



    const model = new ChatMistralAI({
        model: "mistral-small-latest",

    })

    const Chats = []

    while (true) {
        
        const userInput = await rl.question(`${colors.user}You:${colors.reset} `)

        Chats.push(new HumanMessage(userInput))


        const response = await model.invoke(Chats)
        
        Chats.push(response)

        console.log(`${colors.ai}AI: ${response.content}${colors.reset}`);
        
    }

    rl.close()
