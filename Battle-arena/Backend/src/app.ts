import express from 'express';
import type { Response, Request } from 'express';
import { randomUUID } from 'crypto';
import runGraph, { streamGraph } from "./ai/graph.ai.js";
import { touchConversation, saveTurn, listThreads, getThreadTurns, renameThread, deleteThread } from "./db/history.service.js";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from "url";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';


const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.join(__dirname, "../public");

app.use(express.static(publicPath));


app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}));


// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));


// Rate limiting middleware to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Max 100 requests per IP per window
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});


app.use(limiter);

app.use(express.json());

app.get('/', async (req, res) => {
    const problem = "write function to calculate factorial of a number in javascript";
    const threadId = randomUUID();

    const result = await runGraph(problem, threadId);
    res.json(result);
});

// ---- Non-streaming chat -------------------------------------------------

app.post('/chat', async (req: Request, res: Response) => {
    const { message, threadId: incomingThreadId } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({ message: "message is required", success: false });
    }

    const threadId = incomingThreadId || randomUUID();

    try {
        const result = await runGraph(message, threadId);

        await touchConversation(threadId, message);
        await saveTurn({
            threadId,
            problem: message,
            solution_1: result.solution_1,
            solution_2: result.solution_2,
            solution_1_failed: result.solution_1_failed,
            solution_2_failed: result.solution_2_failed,
            judgement: result.judgement,
            search_sources: result.search_sources,
        });

        res.status(200).json({ message: "Result from graph", success: true, threadId, data: result });
    } catch (error) {
        console.error("Graph error:", error);
        res.status(500).json({ message: "Something went wrong while processing your request", success: false, threadId });
    }
});

// ---- Streaming chat (SSE) ------------------------------------------------

app.post('/chat/stream', async (req: Request, res: Response) => {
    const { message, threadId: incomingThreadId } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({ message: "message is required", success: false });
    }

    const threadId = incomingThreadId || randomUUID();

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const send = (event: string, data: unknown) => {
        res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    send("thread", { threadId });

    let finalState: any = null;

    try {
        for await (const { mode, chunk } of streamGraph(message, threadId)) {
            if (mode === "custom") {
                send("token", chunk);
            } else if (mode === "values") {
                // Just track it — don't send yet. Every node completion
                // triggers a "values" snapshot, but only the last one
                // (after judgeNode) actually has real judge scores.
                finalState = chunk;
            }
        }

        if (finalState) {
            // Send exactly one lightweight state event, with only what
            // the UI needs — not the full accumulated message history.
            send("state", {
                solution_1_failed: finalState.solution_1_failed,
                solution_2_failed: finalState.solution_2_failed,
                judgement: finalState.judgement,
                search_sources: finalState.search_sources,
            });

            await touchConversation(threadId, message);
            await saveTurn({
                threadId,
                problem: message,
                solution_1: finalState.solution_1,
                solution_2: finalState.solution_2,
                solution_1_failed: finalState.solution_1_failed,
                solution_2_failed: finalState.solution_2_failed,
                judgement: finalState.judgement,
                search_sources: finalState.search_sources,
            });
        }

        send("done", {});
    } catch (error) {
        console.error("Stream error:", error);
        send("error", { message: "Something went wrong while processing your request" });
    } finally {
        res.end();
    }
});

// ---- History / sidebar ---------------------------------------------------

app.get('/threads', async (req: Request, res: Response) => {
    try {
        const threads = await listThreads();
        res.status(200).json({ success: true, data: threads });
    } catch (error) {
        console.error("List threads error:", error);
        res.status(500).json({ success: false, message: "Failed to list conversations" });
    }
});

app.get('/threads/:threadId', async (req: Request, res: Response) => {
    try {
        const threadId = req.params.threadId as string;
        const turns = await getThreadTurns(threadId);
        res.status(200).json({ success: true, data: turns });
    } catch (error) {
        console.error("Get thread error:", error);
        res.status(500).json({ success: false, message: "Failed to load conversation" });
    }
});

app.patch('/threads/:threadId', async (req: Request, res: Response) => {
    const { title } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ success: false, message: "title is required" });
    }

    try {
        const threadId = req.params.threadId as string;
        const updated = await renameThread(threadId, title);
        if (!updated) {
            return res.status(404).json({ success: false, message: "Conversation not found" });
        }
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Rename thread error:", error);
        res.status(500).json({ success: false, message: "Failed to rename conversation" });
    }
});

app.delete('/threads/:threadId', async (req: Request, res: Response) => {
    try {
        const threadId = req.params.threadId as string;
        await deleteThread(threadId);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Delete thread error:", error);
        res.status(500).json({ success: false, message: "Failed to delete conversation" });
    }
});


app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});


export default app;