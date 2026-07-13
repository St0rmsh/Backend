import { mongoClient } from "./mongo.client.js";

const DB_NAME = "battle_arena";

type Judgement = {
    solution_1_score: number;
    solution_2_score: number;
    solution_1_reasoning: string;
    solution_2_reasoning: string;
};

type SaveTurnInput = {
    threadId: string;
    problem: string;
    solution_1: string;
    solution_2: string;
    solution_1_failed: boolean;
    solution_2_failed: boolean;
    judgement: Judgement;
    search_sources?: { title: string; url: string }[];
};

function getDb() {
    return mongoClient.db(DB_NAME);
}

function truncateTitle(text: string, maxLen = 60): string {
    const trimmed = text.trim();
    return trimmed.length > maxLen ? `${trimmed.slice(0, maxLen).trim()}…` : trimmed;
}

/**
 * Creates the conversation doc if this is the first turn on this thread,
 * otherwise just bumps updatedAt/turnCount. Call this once per turn.
 */
export async function touchConversation(threadId: string, firstProblem: string) {
    const db = getDb();
    const conversations = db.collection("conversations");

    const existing = await conversations.findOne({ threadId });

    if (!existing) {
        await conversations.insertOne({
            threadId,
            title: truncateTitle(firstProblem),
            createdAt: new Date(),
            updatedAt: new Date(),
            turnCount: 1,
        });
    } else {
        await conversations.updateOne(
            { threadId },
            { $set: { updatedAt: new Date() }, $inc: { turnCount: 1 } }
        );
    }
}

export async function saveTurn(input: SaveTurnInput) {
    const db = getDb();
    const turns = db.collection("turns");

    const turnCount = await turns.countDocuments({ threadId: input.threadId });

    await turns.insertOne({
        threadId: input.threadId,
        turnIndex: turnCount,
        problem: input.problem,
        solution_1: input.solution_1,
        solution_2: input.solution_2,
        solution_1_failed: input.solution_1_failed,
        solution_2_failed: input.solution_2_failed,
        judgement: input.judgement,
        search_sources: input.search_sources ?? [],
        createdAt: new Date(),
    });
}

export async function listThreads() {
    const db = getDb();
    return db
        .collection("conversations")
        .find({}, { projection: { _id: 0 } })
        .sort({ updatedAt: -1 })
        .toArray();
}

export async function getThreadTurns(threadId: string) {
    const db = getDb();
    return db
        .collection("turns")
        .find({ threadId }, { projection: { _id: 0 } })
        .sort({ turnIndex: 1 })
        .toArray();
}

export async function renameThread(threadId: string, title: string) {
    const db = getDb();
    const result = await db
        .collection("conversations")
        .updateOne({ threadId }, { $set: { title: truncateTitle(title, 80) } });

    return result.matchedCount > 0;
}

export async function deleteThread(threadId: string) {
    const db = getDb();

    await Promise.all([
        db.collection("conversations").deleteOne({ threadId }),
        db.collection("turns").deleteMany({ threadId }),
        // Also wipe the LangGraph checkpointer's own data for this thread,
        // so memory is genuinely gone, not just hidden from the sidebar.
        db.collection("checkpoints").deleteMany({ thread_id: threadId }),
        db.collection("checkpoint_writes").deleteMany({ thread_id: threadId }),
    ]);
}