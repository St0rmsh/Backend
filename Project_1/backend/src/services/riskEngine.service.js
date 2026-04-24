export function calculateFraudScore({ claims, aiDetection }) {
    let score = 0;

    for (const claim of claims) {

        // 🔴 Truth risk
        switch (claim.verdict) {
            case "FALSE":
                score += 30;
                break;
            case "MISINFORMATION":
                score += 20;
                break;
            case "DISINFORMATION":
                score += 40;
                break;
            case "PARTIALLY TRUE":
                score += 10;
                break;
        }

        // 🔵 weak evidence
        if (!claim.sources || claim.sources.length < 2) {
            score += 10;
        }

        // 🟠 low confidence
        if (claim.confidence < 50) {
            score += 10;
        }
    }

    // 🤖 AI generated risk
    if (aiDetection?.isAi) {
        score += aiDetection.confidence > 70 ? 25 : 10;
    }

    return Math.min(100, Math.max(0, score));
}



export function classifyRisk(score) {
    if (score >= 80) return "CRITICAL_DISINFORMATION";
    if (score >= 60) return "HIGH_RISK";
    if (score >= 40) return "MEDIUM_RISK";
    if (score >= 20) return "LOW_RISK";
    return "SAFE";
}




export function generateRiskReport({ video, claims, aiDetection, fraudScore, riskLevel }) {
    return {
        videoId: video.id,
        title: video.title,
        fraudScore,
        riskLevel,
        summary: `Video analysis complete. Risk level: ${riskLevel}.`,
        claims: claims.map(c => ({
            text: c.text,
            verdict: c.verdict,
            confidence: c.confidence,
            explanation: c.explanation
        })),
        aiDetection,
        timestamp: new Date().toISOString()
    };
}




export async function analyzeVideoRisk({ video }) {
    try {
        // 1. Get AI analysis
        const aiResult = await SearchAndAskAI({ query: `${video.title} ${video.description}` });

        if (!aiResult.success || !aiResult.data) {
            return {
                success: false,
                message: "AI analysis failed."
            };
        }

        const { claims, aiDetection } = aiResult.data;

        // 2. Calculate fraud score
        const fraudScore = calculateFraudScore({ claims, aiDetection });

        // 3. Classify risk level
        const riskLevel = classifyRisk(fraudScore);

        // 4. Generate risk report
        const report = generateRiskReport({
            video,
            claims,
            aiDetection,
            fraudScore,
            riskLevel
        });

        return {
            success: true,
            data: report
        };

    } catch (err) {
        console.error("Risk analysis error:", err);
        return {
            success: false,
            message: "Risk analysis failed."
        };
    }
}

