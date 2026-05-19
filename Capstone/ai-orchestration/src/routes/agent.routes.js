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

        const result = await agent.stream(
            {
                messages: [{
                    role: "user",
                    content: messages
                }]
            },
            {
                configurable: {
                    sandboxId: sandboxId,
                    writer: {
                        write: (msg) => {
                            res.write(`data: ${JSON.stringify({ type: "progress", message: msg })}\n\n`);
                        }
                    }
                },
                writer: {
                    write: (msg) => {
                        res.write(`data: ${JSON.stringify({ type: "progress", message: msg })}\n\n`);
                    }
                }
            }
        );

        let finalMessages = [];
        for await (const chunk of result) {
            console.log(chunk);
            if (chunk.messages) {
                finalMessages = chunk.messages;
                res.write(`data: ${JSON.stringify(chunk.messages)}\n\n`);
            } else if (chunk.values?.messages) {
                finalMessages = chunk.values.messages;
                res.write(`data: ${JSON.stringify(chunk.values.messages)}\n\n`);
            } else {
                for (const key of Object.keys(chunk)) {
                    if (chunk[key]?.messages) {
                        finalMessages = chunk[key].messages;
                        res.write(`data: ${JSON.stringify(chunk[key].messages)}\n\n`);
                    }
                }
            }
        }

        res.write(`data: ${JSON.stringify({
            type: "done",
            message: "Agent invoked successfully",
            result: {
                messages: finalMessages
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