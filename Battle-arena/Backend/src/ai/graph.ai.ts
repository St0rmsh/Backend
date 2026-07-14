import { START, StateGraph, StateSchema, END, MessagesValue, getWriter, type GraphNode } from "@langchain/langgraph";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import z from "zod";
import { GoogleAI, MistralAI, CohereAI } from "./model.ai.js";
import { createAgent, HumanMessage, AIMessage, toolStrategy, BaseMessage } from "langchain";
import { mongoClient } from "../db/mongo.client.js";
import { withRetry, streamWithRetry } from "../utils/retry.js";
import { searchInternet } from "../services/tavily.services.js";

const searchSourceSchema = z.object({
    title: z.string(),
    url: z.string(),
});

const state = new StateSchema({
    problem: z.string(),
    messages: MessagesValue,
    search_context: z.string().default(""),
    search_sources: z.array(searchSourceSchema).default([]),
    solution_1: z.string().default(""),
    solution_2: z.string().default(""),
    solution_1_failed: z.boolean().default(false),
    solution_2_failed: z.boolean().default(false),
    judgement: z.object({
        solution_1_score: z.number().default(0),
        solution_2_score: z.number().default(0),
        solution_1_reasoning: z.string().default(""),
        solution_2_reasoning: z.string().default(""),
    }).default(() => ({
        solution_1_score: 0,
        solution_2_score: 0,
        solution_1_reasoning: "",
        solution_2_reasoning: "",
    })),
});

type StreamEvent =
    | { stage: "search"; type: "start" | "done" | "failed" }
    | { model: "solution_1" | "solution_2"; type: "token"; text: string }
    | { model: "solution_1" | "solution_2"; type: "retry" }
    | { model: "solution_1" | "solution_2"; type: "done" | "failed" };

// ---- Search node (Tavily grounding) --------------------------------------

const searchNode: GraphNode<typeof state> = async (state) => {
    const write = getWriter() as ((chunk: StreamEvent) => void) | undefined;
    write?.({ stage: "search", type: "start" });

    try {
        const result = await withRetry(() => searchInternet(state.problem), {
            retries: 1,
            baseDelayMs: 1000,
            timeoutMs: 15000,
            label: "Tavily",
        });

        write?.({ stage: "search", type: "done" });

        // Use Tavily's own synthesized answer only — it has already
        // reconciled multiple sources into one coherent summary.
        // Feeding raw, possibly-conflicting snippets on top of this
        // caused models to hedge and second-guess out loud instead
        // of just answering. Raw results are still kept separately
        // in search_sources for the UI citation chips.
        const context = result.answer
            ? `Current information from a live web search (use this as ground truth for anything time-sensitive or factual — do not question it, do not mention conflicting sources, and do not mention that this came from a search):\n${result.answer}`
            : "";

        return {
            search_context: context,
            search_sources: result.results.map((r) => ({ title: r.title, url: r.url })),
        };
    } catch (err) {
        console.error("[Tavily] search failed after retries:", (err as Error).message);
        write?.({ stage: "search", type: "failed" });
        return { search_context: "", search_sources: [] };
    }
};

// ---- Solution node (parallel models, streamed, resilient) ----------------

const solutionNode: GraphNode<typeof state> = async (state) => {
    const baseHistory = [...state.messages, new HumanMessage(state.problem)];

    const history = state.search_context
        ? [
              ...baseHistory,
              new HumanMessage(
                  `${state.search_context}\n\nUsing the above as current, accurate context where relevant, answer the original problem directly and confidently.`
              ),
          ]
        : baseHistory;

    const write = getWriter() as ((chunk: StreamEvent) => void) | undefined;

    const runModel = (chatModel: typeof MistralAI | typeof CohereAI, tag: "solution_1" | "solution_2", label: string) =>
        streamWithRetry(() => chatModel.stream(history), {
            getText: (chunk) => chunk.text ?? "",
            onChunk: (text) => write?.({ model: tag, type: "token", text }),
            onRetryStart: () => write?.({ model: tag, type: "retry" }),
            retries: 2,
            baseDelayMs: 1000,
            idleTimeoutMs: 20000,
            label,
        });

    const [mistralResult, cohereResult] = await Promise.allSettled([
        runModel(MistralAI, "solution_1", "Mistral"),
        runModel(CohereAI, "solution_2", "Cohere"),
    ]);

    const solution_1_failed = mistralResult.status === "rejected";
    const solution_2_failed = cohereResult.status === "rejected";

    if (solution_1_failed && solution_2_failed) {
        throw new Error("Both models failed to respond. Please try again.");
    }

    const solution_1 = solution_1_failed ? "" : mistralResult.value;
    const solution_2 = solution_2_failed ? "" : cohereResult.value;

    write?.({ model: "solution_1", type: solution_1_failed ? "failed" : "done" });
    write?.({ model: "solution_2", type: solution_2_failed ? "failed" : "done" });

    const newMessages: BaseMessage[] = [new HumanMessage(state.problem)];
    if (!solution_1_failed) {
        newMessages.push(new AIMessage(`[Solution Alpha / Mistral]: ${solution_1}`));
    }
    if (!solution_2_failed) {
        newMessages.push(new AIMessage(`[Solution Beta / Cohere]: ${solution_2}`));
    }

    return {
        solution_1,
        solution_2,
        solution_1_failed,
        solution_2_failed,
        messages: newMessages,
    };
};

// ---- Judge node ------------------------------------------------------------

const judgeNode: GraphNode<typeof state> = async (state) => {
    const { problem, solution_1, solution_2, solution_1_failed, solution_2_failed } = state;

    if (solution_1_failed || solution_2_failed) {
        return {
            judgement: {
                solution_1_score: solution_1_failed ? 0 : 10,
                solution_2_score: solution_2_failed ? 0 : 10,
                solution_1_reasoning: solution_1_failed
                    ? "Mistral was unavailable for this turn after retries."
                    : "Won by default — the competing model was unavailable.",
                solution_2_reasoning: solution_2_failed
                    ? "Cohere was unavailable for this turn after retries."
                    : "Won by default — the competing model was unavailable.",
            },
        };
    }

    const judge = createAgent({
        model: GoogleAI,
        responseFormat: toolStrategy(
            z.object({
                solution_1_score: z.number().min(0).max(10),
                solution_2_score: z.number().min(0).max(10),
                solution_1_reasoning: z.string().default(""),
                solution_2_reasoning: z.string().default(""),
            })
        ),
        systemPrompt: `You are a judge tasked with evaluating two solutions generated by two different AI models to the following problem: ${problem}. Please provide a score between 0 and 10 for each solution, along with your reasoning for the score.`,
    });

    const judgeResponse = await withRetry(
        () =>
            judge.invoke({
                messages: [
                    new HumanMessage(`Problem: ${problem}
                        Solution 1: ${solution_1}
                        Solution 2: ${solution_2}
                        Please provide your evaluation in the specified format.`),
                ],
            }),
        { retries: 1, baseDelayMs: 1000, timeoutMs: 25000, label: "Judge" }
    );

    const { solution_1_score, solution_2_score, solution_1_reasoning, solution_2_reasoning } =
        judgeResponse.structuredResponse;

    return {
        judgement: {
            solution_1_score,
            solution_2_score,
            solution_1_reasoning,
            solution_2_reasoning,
        },
    };
};

// ---- Graph assembly ----------------------------------------------------------

const checkpointer = new MongoDBSaver({
    client: mongoClient,
    dbName: "battle_arena",
});

const graph = new StateGraph(state)
    .addNode("searchNode", searchNode)
    .addNode("solutionNode", solutionNode)
    .addNode("judgeNode", judgeNode)
    .addEdge(START, "searchNode")
    .addEdge("searchNode", "solutionNode")
    .addEdge("solutionNode", "judgeNode")
    .addEdge("judgeNode", END)
    .compile({ checkpointer });

export default async function (problem: string, threadId: string) {
    const response = await graph.invoke(
        { problem },
        { configurable: { thread_id: threadId } }
    );

    return response;
}

export async function* streamGraph(problem: string, threadId: string) {
    const stream = await graph.stream(
        { problem },
        { configurable: { thread_id: threadId }, streamMode: ["custom", "values"] }
    );

    for await (const [mode, chunk] of stream) {
        yield { mode, chunk };
    }
}