import {ChatGoogleGenerativeAI} from "@langchain/google-genai"



const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
});


export async function TestAi(){
    // model.invoke("How to use Ai with 100% capability ? ").then((response)=>{
    //     console.log(response.text);
        
    // })
}


