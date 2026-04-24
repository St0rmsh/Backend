import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import config from "../config/config.js";
import { searchInternet } from "./internet.service.js";
import {
    analyzeVideoRisk,
    generateRiskReport
} from "./riskEngine.service.js";






// 🧠 MODEL
const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: config.GOOGLE_API_KEY
});




// ⏱️ TIMEOUT WRAPPER
function withTimeout(promise, ms = 20000) {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), ms)
        )
    ]);
}




// ==========================
// 🧩 1. CLAIM EXTRACTION
// ==========================
async function extractClaims(input) {
    const res = await model.invoke([
        {
            role: "system",
            content: `
Extract ONLY factual claims.

Return JSON:
{
  "claims": ["claim1", "claim2"]
}

Ignore opinions, jokes, filler.
`
        },
        {
            role: "user",
            content: input
        }
    ]);

    const match = res.content.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : { claims: [] };
}

// ==========================
// 🔍 2. SEARCH PER CLAIM
// ==========================
async function searchClaim(claim) {
    const queries = [
        claim,
        `${claim} fact check`,
        `${claim} statistics source`
    ];

    const results = await Promise.all(
        queries.map(q => searchInternet({ query: q }))
    );

    return {
        claim,
        sources: results.flat()
    };
}

// ==========================
// 🧠 3. VERIFY CLAIM
// ==========================
async function verifyClaim({ claim, searchResults }) {
    const res = await model.invoke([
        {
            role: "system",
            content: `
You are a strict fact verifier.

Rules:
- Use ONLY provided search results
- Do NOT assume anything
- Extract sources if present

Return JSON:
{
  "verdict": "TRUE | PARTIALLY TRUE | FALSE | MISINFORMATION | DISINFORMATION | UNVERIFIED",
  "confidence": 0-100,
  "explanation": "",
  "sources": ["url1", "url2"]
}
`
        },
        {
            role: "user",
            content: JSON.stringify({ claim, searchResults })
        }
    ]);

    const match = res.content.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : null;

    return parsed
        ? { text: claim, ...parsed }
        : {
              text: claim,
              verdict: "UNVERIFIED",
              confidence: 0,
              explanation: "parse failed",
              sources: []
          };
}

// ==========================
// 🤖 4. AI DETECTION
// ==========================
async function detectAI(text) {
    const res = await model.invoke([
        {
            role: "system",
            content: `
Detect if content is AI-generated.

Check for:
- synthetic phrasing
- generation artifacts
- references to tools like Sora, Runway, Pika, D-ID, HeyGen

Return JSON:
{
  "isAi": boolean,
  "modelUsed": "",
  "confidence": 0-100,
  "reasoning": ""
}
`
        },
        {
            role: "user",
            content: text
        }
    ]);

    const match = res.content.match(/\{[\s\S]*\}/);
    return match
        ? JSON.parse(match[0])
        : {
              isAi: false,
              modelUsed: "",
              confidence: 0,
              reasoning: ""
          };
}

// ==========================
// 📊 5. FINAL AGGREGATION
// ==========================
async function aggregate(results) {
    const res = await model.invoke([
        {
            role: "system",
            content: `
You are a fact-check aggregator.

Return STRICT JSON:
{
  "summary": "",
  "claims": [],
  "finalVerdict": "TRUE | PARTIALLY TRUE | FALSE | MISINFORMATION | DISINFORMATION | UNKNOWN",
  "confidence": 0-100,
  "truth": "",
  "issues": [],
  "sources": []
}
`
        },
        {
            role: "user",
            content: JSON.stringify(results)
        }
    ]);

    const match = res.content.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
}

// ==========================
// 🚀 MAIN PIPELINE
// ==========================
export async function SearchAndAskAI({ query }) {
    try {
        // 1️⃣ Extract claims
        const extracted = await withTimeout(extractClaims(query));

        // 2️⃣ Search per claim
        const searched = await Promise.all(
            extracted.claims.map(claim =>
                withTimeout(searchClaim(claim))
            )
        );

        // 3️⃣ Verify claims
        const verified = await Promise.all(
            searched.map(item =>
                withTimeout(
                    verifyClaim({
                        claim: item.claim,
                        searchResults: item.sources
                    })
                )
            )
        );

        // 4️⃣ AI detection
        const aiDetection = await withTimeout(detectAI(query));

        // 5️⃣ Risk Analysis (🔥 upgraded)
        const riskAnalysis = analyzeVideoRisk({
            claims: verified,
            aiDetection
        });

        const fraudScore = riskAnalysis.score;
        const riskLevel = riskAnalysis.level;
        const riskReport = generateRiskReport(riskAnalysis);

        // 6️⃣ Aggregate
        const final = await withTimeout(
            aggregate({
                claims: verified,
                aiDetection
            })
        );

        // 🧹 fallback
        const output = final || {
            summary: "Failed to generate result",
            claims: [],
            finalVerdict: "UNKNOWN",
            confidence: 0,
            truth: "",
            issues: ["pipeline failure"],
            sources: []
        };

        // 🧼 normalize
        output.sources = [...new Set(output.sources || [])];
        output.confidence = Math.max(
            0,
            Math.min(100, output.confidence || 0)
        );

        return {
            success: true,
            data: {
                ...output,

                aiDetection,

                // 🔥 RISK ENGINE OUTPUT
                fraudScore,
                riskLevel,
                riskReport
            }
        };
    } catch (err) {
        console.error("Pipeline Error:", err.message);

        return {
            success: false,
            data: null
        };
    }
}
