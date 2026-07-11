import {
  START,
  END,
  StateGraph,
  StateSchema,
  ReducedValue,
  MemorySaver,
  type GraphNode,
} from "@langchain/langgraph";
import z from "zod";
import { GoogleAI, MistralAI, CohereAI } from "./model.ai.js";
import { createAgent, HumanMessage, providerStrategy } from "langchain";
import { searchInternet } from "../services/tavily.services.js";
import config from "../config/config.js";

// BUG FIX (typing): the original StateSchema mixed a bare `z.object` for judgement with
// no `.default()`, so a fresh thread's first `graph.invoke` could read `undefined` fields
// off it before judgeNode ran. Every field below has an explicit, safe default.
const judgementSchema = z.object({
  solution_1_score: z.number().min(0).max(10).default(0),
  solution_2_score: z.number().min(0).max(10).default(0),
  solution_1_reasoning: z.string().default(""),
  solution_2_reasoning: z.string().default(""),
});

const state = new StateSchema({
  problem: z.string(),
  solution_1: z.string().default(""),
  solution_2: z.string().default(""),
  // NEW: surfaced to the client instead of silently swallowing a provider failure.
  solution_1_error: z.string().default(""),
  solution_2_error: z.string().default(""),
  judgement: judgementSchema.default(() => ({
    solution_1_score: 0,
    solution_2_score: 0,
    solution_1_reasoning: "",
    solution_2_reasoning: "",
  })),
  // NEW: conversation memory. Each turn appends one summary line; the reducer keeps
  // only the most recent `memoryTurns` (5-10, configurable) so the prompt never grows
  // unbounded and old turns don't blow the context window.
  history: new ReducedValue(z.array(z.string()).default(() => []), {
    inputSchema: z.string(),
    reducer: (current, next) => [...current, next].slice(-config.memoryTurns),
  }),
});

const historyToContext = (history: string[]) => {
  if (history.length === 0) return "";
  return `Here is a summary of the previous turns in this conversation, most recent last:\n${history
    .map((h, i) => `${i + 1}. ${h}`)
    .join("\n")}\n\n`;
};

const solutionNode: GraphNode<typeof state> = async (state) => {
  const memoryContext = historyToContext(state.history);

  // NEW (optional feature): ground both solutions with a quick web search when a
  // Tavily key is configured. Degrades to "" automatically if it's not, or if the
  // search fails — see tavily.service.ts.
  const grounding = config.TAVILY_API_KEY
    ? await searchInternet(state.problem).then((r) => r.answer)
    : "";

  const prompt = `${memoryContext}${
    grounding ? `Relevant context from the web: ${grounding}\n\n` : ""
  }Problem: ${state.problem}`;

  // BUG FIX: the original Promise.all([...]) meant a single provider outage (rate
  // limit, bad key, timeout) threw and killed the whole request with no useful error.
  // Promise.allSettled lets one model fail while the other still produces a result.
  const [mistralResult, cohereResult] = await Promise.allSettled([
    MistralAI.invoke(prompt),
    CohereAI.invoke(prompt),
  ]);

  return {
    solution_1:
      mistralResult.status === "fulfilled" ? String(mistralResult.value.content) : "",
    solution_2:
      cohereResult.status === "fulfilled" ? String(cohereResult.value.content) : "",
    solution_1_error:
      mistralResult.status === "rejected" ? String(mistralResult.reason) : "",
    solution_2_error:
      cohereResult.status === "rejected" ? String(cohereResult.reason) : "",
  };
};

const judgeNode: GraphNode<typeof state> = async (state) => {
  const { problem, solution_1, solution_2, solution_1_error, solution_2_error } = state;

  // If a provider failed entirely, don't ask the judge to score empty text — award the
  // win to whichever solution actually exists instead of an LLM call that would just
  // hallucinate a comparison.
  if (solution_1_error && !solution_2_error) {
    return {
      judgement: {
        solution_1_score: 0,
        solution_2_score: 8,
        solution_1_reasoning: "Solution Alpha failed to generate a response.",
        solution_2_reasoning: "Won by default: the other model errored out.",
      },
      history: `Problem: "${problem}" -> Solution Beta won by default (Alpha errored).`,
    };
  }
  if (solution_2_error && !solution_1_error) {
    return {
      judgement: {
        solution_1_score: 8,
        solution_2_score: 0,
        solution_1_reasoning: "Won by default: the other model errored out.",
        solution_2_reasoning: "Solution Beta failed to generate a response.",
      },
      history: `Problem: "${problem}" -> Solution Alpha won by default (Beta errored).`,
    };
  }
  if (solution_1_error && solution_2_error) {
    return {
      judgement: {
        solution_1_score: 0,
        solution_2_score: 0,
        solution_1_reasoning: solution_1_error,
        solution_2_reasoning: solution_2_error,
      },
      history: `Problem: "${problem}" -> both models errored, no winner.`,
    };
  }

  const judge = createAgent({
    model: GoogleAI,
    responseFormat: providerStrategy(judgementSchema),
    systemPrompt: `You are a judge tasked with evaluating two solutions generated by two different AI models to the following problem: ${problem}. Please provide a score between 0 and 10 for each solution, along with your reasoning for the score.`,
  });

  try {
    const judgeResponse = await judge.invoke({
      messages: [
        new HumanMessage(
          `Problem: ${problem}\nSolution 1: ${solution_1}\nSolution 2: ${solution_2}\nPlease provide your evaluation in the specified format.`
        ),
      ],
    });

    const judgement = judgeResponse.structuredResponse;
    const winner = judgement.solution_1_score >= judgement.solution_2_score ? "Alpha" : "Beta";

    return {
      judgement,
      history: `Problem: "${problem}" -> Solution ${winner} won (${Math.max(
        judgement.solution_1_score,
        judgement.solution_2_score
      )}/10).`,
    };
  } catch (error) {
    // BUG FIX: the judge call had no error handling at all — a malformed structured
    // response or a Google API hiccup would 500 the whole /chat request.
    console.error("Judge node failed:", error);
    return {
      judgement: {
        solution_1_score: 5,
        solution_2_score: 5,
        solution_1_reasoning: "The judge could not be reached; scored as a tie.",
        solution_2_reasoning: "The judge could not be reached; scored as a tie.",
      },
      history: `Problem: "${problem}" -> judge failed, scored as a tie.`,
    };
  }
};

const graph = new StateGraph(state)
  .addNode("solutionNode", solutionNode)
  .addNode("judgeNode", judgeNode)
  .addEdge(START, "solutionNode")
  .addEdge("solutionNode", "judgeNode")
  .addEdge("judgeNode", END);

// NEW: conversation memory needs state to persist between separate HTTP requests, which
// means the graph needs a checkpointer keyed by a thread_id (one per browser session).
// MemorySaver is fine for local dev; swap for a Postgres/Sqlite saver in production.
const checkpointer = new MemorySaver();
const compiledGraph = graph.compile({ checkpointer });

export default async function runGraph(problem: string, threadId: string) {
  const response = await compiledGraph.invoke(
    { problem },
    { configurable: { thread_id: threadId } }
  );

  return response;
}

// NEW: lets the server offer a "start a new conversation" endpoint without restarting
// the process — just hand it a fresh thread_id from the client and this thread's
// checkpoint history is simply never read again (MemorySaver has no explicit delete,
// so the cheapest correct fix is: don't reuse old thread_ids).
export function newThreadId() {
  return crypto.randomUUID();
}