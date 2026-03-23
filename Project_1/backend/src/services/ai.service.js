import { ChatMistralAI } from "@langchain/mistralai";
import config from "../config/config.js";
import { searchInternet } from "./internet.service.js";
import { HumanMessage, SystemMessage, createAgent, tool } from "langchain";
import * as z from "zod";

const model = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: config.MISTRAL_API_KEY
});

const searchTool = tool(searchInternet, {
    name: "search_internet",
    description: "Search internet for accurate info",
    schema: z.object({
        query: z.string()
    })
});

const agent = createAgent({
    model,
    tools: [searchTool]
});

export async function SearchAndAskAI({ query }) {
    try {
        const response = await Promise.race([
            agent.invoke({
                messages: [
      new SystemMessage(`
You are a professional fact-checking AI for video content.

STRICT WORKFLOW:

STEP 1: Extract ALL factual claims (ignore opinions)

STEP 2: For EACH claim:
- Use search_internet tool
- Cross-check at least 2 sources
- Detect:
  - exaggeration
  - outdated info
  - missing context
  - fake statistics

STEP 3: Assign:
- verdict: TRUE | PARTIALLY TRUE | FALSE | UNVERIFIED
- confidence: 0–100

STEP 4: Build final verdict:
- Mostly TRUE → TRUE
- Mixed → PARTIALLY TRUE
- Mostly FALSE → FALSE

STEP 5: Detect:
- misleading framing
- clickbait
- incorrect sources mentioned in video

RETURN STRICT JSON:

{
  "summary": "Short summary",
  "claims": [
    {
      "text": "claim",
      "verdict": "TRUE | PARTIALLY TRUE | FALSE | UNVERIFIED",
      "confidence": 0-100,
      "explanation": "why",
      "sources": ["url1","url2"]
    }
  ],
  "finalVerdict": "TRUE | PARTIALLY TRUE | FALSE",
  "confidence": 0-100,
  "truth": "actual correct explanation",
  "issues": ["misleading points"],
  "sources": ["merged unique sources"]
}
`),

                    new HumanMessage(query)
                ]
            }),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("AI Timeout")), 30000)
            )
        ]);

        const last = response.messages?.at(-1);
        let output = last?.content || "";

        if (typeof output !== "string") {
            output = JSON.stringify(output);
        }

        let parsed;

try {
    const match = output.match(/\{[\s\S]*\}/);
    parsed = match ? JSON.parse(match[0]) : null;
} catch {
    parsed = null;
}

if (!parsed) {
    parsed = {
        summary: output,
        claims: [],
        finalVerdict: "UNKNOWN",
        confidence: 0,
        sources: []
    };
}

// ✅ sanitize
parsed.claims = parsed.claims || [];
parsed.sources = [...new Set(parsed.sources || [])];

// normalize verdict
const valid = ["TRUE", "PARTIALLY TRUE", "FALSE"];
if (!valid.includes(parsed.finalVerdict)) {
    parsed.finalVerdict = "UNKNOWN";
}

// confidence clamp
parsed.confidence = Math.max(0, Math.min(100, parsed.confidence || 0));

        return { success: true, data: parsed };

    } catch (err) {
        console.error("AI Error:", err.message);
        return { success: false, data: null };
    }
}
