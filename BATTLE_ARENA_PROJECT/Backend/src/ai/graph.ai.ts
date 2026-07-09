import {
    StateGraph,
    START,
    END,
    Annotation,
} from "@langchain/langgraph";

import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";

import {
    GoogleAI,
    MistralAI,
    CohereAI,
} from "./model.ai.js";

import { searchInternet } from "../services/tavily.services.js";
import {
    solutionPrompt,
    judgePrompt,
} from "./prompt.js";

/* ==========================================================
STATE
========================================================== */

const BattleState = Annotation.Root({

    problem: Annotation<string>(),

    research: Annotation<string>({
        default: () => "",
    }),

    solution1: Annotation<string>({
        default: () => "",
    }),

    solution2: Annotation<string>({
        default: () => "",
    }),

    judge: Annotation<{
        solution_1_score: number;
        solution_2_score: number;
        solution_1_reasoning: string;
        solution_2_reasoning: string;
        winner: "solution_1" | "solution_2";
    }>({
        default: () => ({
            solution_1_score: 0,
            solution_2_score: 0,
            solution_1_reasoning: "",
            solution_2_reasoning: "",
            winner: "solution_1",
        }),
    }),

    executionTime: Annotation<number>({
        default: () => 0,
    }),

});

/* ==========================================================
RESEARCH NODE
========================================================== */

async function researchNode(
    state: typeof BattleState.State
) {

    const result = await searchInternet(state.problem);

    const research = [

        result.answer,

        ...result.results.map(

            (r) =>

                `Title: ${r.title}

${r.content}`

        ),

    ].join("\n\n");

    return {

        research,

    };
}

/* ==========================================================
SOLUTION NODE
========================================================== */

async function solutionNode(
    state: typeof BattleState.State
) {

    const prompt = solutionPrompt(

        state.problem,

        state.research

    );

    const [mistral, cohere] = await Promise.all([

        MistralAI.invoke([

            new SystemMessage(prompt),

            new HumanMessage(state.problem),

        ]),

        CohereAI.invoke([

            new SystemMessage(prompt),

            new HumanMessage(state.problem),

        ]),

    ]);

    return {

        solution1: mistral.text,

        solution2: cohere.text,

    };
}

/* ==========================================================
JUDGE NODE
========================================================== */

const JudgeSchema = z.object({

    solution_1_score: z.number(),

    solution_2_score: z.number(),

    solution_1_reasoning: z.string(),

    solution_2_reasoning: z.string(),

    winner: z.enum([
        "solution_1",
        "solution_2",
    ]),

});

async function judgeNode(
    state: typeof BattleState.State
) {

    const response = await GoogleAI.withStructuredOutput(

        JudgeSchema

    ).invoke([

        new SystemMessage(

            judgePrompt(

                state.problem,

                state.solution1,

                state.solution2

            )

        ),

    ]);

    return {

        judge: response,

    };
}

/* ==========================================================
TIME NODE
========================================================== */

async function timerNode(
    state: typeof BattleState.State
) {

    return {

        executionTime:

            Date.now(),

    };
}

/* ==========================================================
GRAPH
========================================================== */

export const graph = new StateGraph(

    BattleState

)

    .addNode(

        "research",

        researchNode

    )

    .addNode(

        "solution",

        solutionNode

    )

    .addNode(

        "judge",

        judgeNode

    )

    .addEdge(

        START,

        "research"

    )

    .addEdge(

        "research",

        "solution"

    )

    .addEdge(

        "solution",

        "judge"

    )

    .addEdge(

        "judge",

        END

    )

    .compile();

/* ==========================================================
RUN GRAPH
========================================================== */

export async function battleArena(

    problem: string

) {

    const start = performance.now();

    const result = await graph.invoke({

        problem,

    });

    const end = performance.now();

    return {

        ...result,

        executionTime: Number(

            (end - start).toFixed(2)

        ),

    };
}

export default battleArena;