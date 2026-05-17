import express from "express";
import agent from "../agent/code.agent.js"


const agentRouter = express.Router();


agentRouter.post("/invoke",async (req,res) => {
    try {
        const {messages, sandboxId} = req.body;

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

        const result = await agent.invoke(
            {
                messages:[{
                    role: "user",
                    content: messages
                }]
            },
            {
                configurable: {
                    sandboxId: sandboxId
                }
            }
        )

        return res.status(200).json({
            message: "Agent invoked successfully",
            result
        })
    } catch (error) {
        console.log("error in invoke",error)
        return res.status(500).json({
            message: "Internal server error",
            error
        })
    }
})

export default agentRouter;