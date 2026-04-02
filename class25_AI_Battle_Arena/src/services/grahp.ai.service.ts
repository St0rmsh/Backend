import { HumanMessage } from "@langchain/core/messages";
import {StateSchema, MessagesValue, ReducedValue, StateGraph ,START,END} from "@langchain/langgraph"
import type {GraphNode} from "@langchain/langgraph"
import { geminiModel,mistralModel,cohereModel } from "./model.service.js";
import {createAgent,providerStrategy} from "langchain"
import {z} from "zod"

const state = new StateSchema({
    messages: MessagesValue,
    solution_1: new ReducedValue(z.string().default(""),{
        reducer: (current,next)=>{
            return next
        }
    }),
    solution_2: new ReducedValue(z.string().default(""),{
        reducer: (current, next)=>{
            return next
        }
    }),
    judge_recommendation: new ReducedValue(z.object().default({
        solution_1_score: 0,
        solution_2_score:0
    }),{
        reducer: (cuurent ,next)=>{
            return next
        }
    })

})


const judgeNode: GraphNode<typeof state> = async(state: typeof state)=>{

    const {solution_1, solution_2} = state;

    const judge = createAgent({
        model: geminiModel,
        tools: [],
        responseFormat: providerStrategy(z.object({
            solution_1_score: z.number().min(0).max(10),
            solution_2_score: z.number().min(0).max(10)
        }))
    })

    const judge_Response = await judge.invoke({
        messages: [
        new HumanMessage(`You are a judge tasked with evaluating the quality of two solutions to a problem. You have to judge between two solutions for the following question: ${state.messages[0].text}. The first solution is: ${solution_1}. The second solution is: ${solution_2}. Give scores to both solutions between 0 and 10, where 10 is the best score and 0 is the worst score. You have to give reasoning for your scores as well.`)
    
        ]
    })

    const result = judge_Response.structuredResponse;

    return {
        judge_recommendation: result
    }
}

const solutionNode: GraphNode<typeof state> = async(state: typeof state)=>{

    const [mistral_solution, cohere_solution] = await Promise.all([
        mistralModel.invoke(state.messages[0].text),
        cohereModel.invoke(state.messages[0].text),

    ])
    return {
        solution_1: mistral_solution.text,
        solution_2: cohere_solution.text
    }
    
}


const graph = new StateGraph(state)
   .addNode("solution", solutionNode )
   .addNode("judge", judgeNode)
   .addEdge(START, "solution")
   .addEdge("solution", "judge")
   .addEdge("judge", END)
   .compile()


   export default async function (usermessage: string) {
    const result = await graph.invoke({
        messages: [
            new HumanMessage(usermessage)
        ]
    })

    console.log(result);
    
    return result;
   }