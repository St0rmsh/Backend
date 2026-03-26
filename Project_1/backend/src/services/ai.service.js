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
You are a STRICT fact-checking AI system.

INPUT:
- Video title
- Description
- Transcript (may be long)

========================
🚨 RULES (MANDATORY)
========================
1. You MUST extract factual claims FIRST
2. You MUST verify EACH claim using search_internet tool
3. You MUST NOT skip tool usage
4. If no reliable source → mark UNVERIFIED
5. DO NOT guess
6. DO NOT assume correctness

========================
🎯 CLAIM EXTRACTION
========================
Extract ONLY:
- statistics (numbers, percentages)
- historical facts
- scientific claims
- news statements

IGNORE:
- opinions
- jokes
- personal experiences

========================
🔎 VERIFICATION
========================
For EACH claim:
- call search_internet
- compare at least 2 sources
- detect:
  - exaggeration
  - outdated info
  - missing context
  - fake statistics

========================
📊 OUTPUT FORMAT
========================
Return STRICT JSON:

{
  "summary": "short overall accuracy summary",
  "claims": [
    {
      "text": "claim",
      "verdict": "TRUE | PARTIALLY TRUE | FALSE | UNVERIFIED",
      "confidence": 0-100,
      "explanation": "reason",
      "sources": ["url1","url2"]
    }
  ],
  "finalVerdict": "TRUE | PARTIALLY TRUE | FALSE | UNKNOWN",
  "confidence": 0-100,
  "truth": "correct explanation",
  "issues": ["list of problems"],
  "sources": ["merged unique sources"]
}

========================
⚠️ IMPORTANT
========================
- JSON ONLY
- No markdown
- No extra text
- Always include all fields
`)
                    ,
                    new HumanMessage(query)
                ]
            }),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("AI Timeout")), 30000)
            )
        ]);

        const last = response.messages?.at(-1);
        let output = last?.content || "";

        // 🧠 normalize output
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

        // 🛡 fallback (VERY IMPORTANT)
        if (!parsed) {
            parsed = {
                summary: "AI failed to return structured output",
                claims: [],
                finalVerdict: "UNKNOWN",
                confidence: 0,
                truth: "",
                issues: ["Parsing failed"],
                sources: []
            };
        }

        // ✅ safety cleanup
        parsed.claims = parsed.claims || [];
        parsed.sources = [...new Set(parsed.sources || [])];
        parsed.issues = parsed.issues || [];

        const valid = ["TRUE", "PARTIALLY TRUE", "FALSE", "UNKNOWN"];
        if (!valid.includes(parsed.finalVerdict)) {
            parsed.finalVerdict = "UNKNOWN";
        }

        parsed.confidence = Math.max(0, Math.min(100, parsed.confidence || 0));

        return { success: true, data: parsed };

    } catch (err) {
        console.error("AI Error:", err.message);
        return { success: false, data: null };
    }
}

