import express from "express";
import agent from "../agent/code.agent.js"


const agentRouter = express.Router();


agentRouter.post("/invoke", async (req, res) => {
    try {
        const { messages, sandboxId } = req.body;

        if (!messages) {
            return res.status(400).json({
                message: "Missing 'messages' in request body"
            });
        }

        if (!sandboxId) {
            return res.status(400).json({
                message: "Missing 'sandboxId' in request body"
            });
        }

        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        });

        // Central writer used by the agent's tools — detects diff payloads
        // (tagged with __DIFF__) and emits them as a distinct SSE event type,
        // separate from plain progress text.
        const write = (msg) => {
            if (typeof msg === "string" && msg.startsWith("__DIFF__")) {
                try {
                    const diffs = JSON.parse(msg.slice("__DIFF__".length));
                    res.write(`data: ${JSON.stringify({ type: "file-diff", diffs })}\n\n`);
                } catch (e) {
                    console.error("Failed to parse diff payload:", e);
                }
            } else {
                res.write(`data: ${JSON.stringify({ type: "progress", message: msg })}\n\n`);
            }
        };

        const stream = await agent.stream(
            {
                messages: [{
                    role: "user",
                    content: messages
                }]
            },
            {
                configurable: {
                    sandboxId: sandboxId,
                    writer: { write }
                },
                streamMode: "messages"
            }
        );

        let finalMessage = "";

        for await (const [chunk, metadata] of stream) {
            if (chunk.tool_call_chunks && chunk.tool_call_chunks.length > 0) {
                continue;
            }

            if (chunk.content) {
                res.write(`data: ${JSON.stringify({ type: "text-chunk", message: chunk.content })}\n\n`);
                finalMessage += chunk.content;
            }
        }

        res.write(`data: ${JSON.stringify({
            type: "done",
            message: "Agent invoked successfully",
            result: {
                content: finalMessage
            }
        })}\n\n`);
        res.end();
    } catch (error) {
        console.error("error in invoke:", error);
        if (res.headersSent) {
            res.write(`data: ${JSON.stringify({
                type: "error",
                message: "Internal server error",
                error: error.message || String(error)
            })}\n\n`);
            res.end();
        } else {
            res.status(500).json({
                message: "Internal server error",
                error: error.message || String(error)
            });
        }
    }
})

export default agentRouter;