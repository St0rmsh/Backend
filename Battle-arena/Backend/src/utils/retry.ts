type RetryOptions = {
    retries?: number;
    baseDelayMs?: number;
    timeoutMs?: number;
    label?: string;
};

class TimeoutError extends Error {
    constructor(label: string, ms: number) {
        super(`${label} timed out after ${ms}ms`);
        this.name = "TimeoutError";
    }
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new TimeoutError(label, ms)), ms);
        promise
            .then((val) => {
                clearTimeout(timer);
                resolve(val);
            })
            .catch((err) => {
                clearTimeout(timer);
                reject(err);
            });
    });
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Runs fn() with a per-attempt timeout, retrying on failure with
 * exponential backoff. Throws the last error if all attempts fail.
 * Used for single-shot calls (judge, Tavily search).
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    { retries = 2, baseDelayMs = 1000, timeoutMs = 20000, label = "call" }: RetryOptions = {}
): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await withTimeout(fn(), timeoutMs, label);
        } catch (err) {
            lastError = err;
            const isLastAttempt = attempt === retries;
            console.error(`[${label}] attempt ${attempt + 1}/${retries + 1} failed:`, (err as Error).message);

            if (!isLastAttempt) {
                await sleep(baseDelayMs * Math.pow(2, attempt));
            }
        }
    }

    throw lastError;
}

type StreamRetryOptions<TChunk> = {
    getText: (chunk: TChunk) => string;
    onChunk: (text: string, attempt: number) => void;
    onRetryStart?: (attempt: number) => void;
    retries?: number;
    baseDelayMs?: number;
    idleTimeoutMs?: number; // max time allowed between two consecutive chunks
    label?: string;
};

/**
 * Consumes an async-iterable stream (e.g. a chat model's .stream() call),
 * forwarding each chunk's text to onChunk as soon as it arrives.
 * If the stream stalls (no chunk within idleTimeoutMs) or throws,
 * the whole attempt is discarded and restarted from scratch —
 * onRetryStart fires so the caller can tell the client to clear
 * whatever partial text it already rendered.
 * Returns the full accumulated text on success.
 */
export async function streamWithRetry<TChunk>(
    factory: () => Promise<AsyncIterable<TChunk>> | AsyncIterable<TChunk>,
    {
        getText,
        onChunk,
        onRetryStart,
        retries = 2,
        baseDelayMs = 1000,
        idleTimeoutMs = 20000,
        label = "stream",
    }: StreamRetryOptions<TChunk>
): Promise<string> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= retries; attempt++) {
        if (attempt > 0) {
            onRetryStart?.(attempt);
            await sleep(baseDelayMs * Math.pow(2, attempt - 1));
        }

        let accumulated = "";
        try {
            const iterable = await factory();
            const iterator = iterable[Symbol.asyncIterator]();

            while (true) {
                const result = await withTimeout(iterator.next(), idleTimeoutMs, label);
                if (result.done) break;

                const text = getText(result.value);
                if (text) {
                    accumulated += text;
                    onChunk(text, attempt);
                }
            }

            return accumulated;
        } catch (err) {
            lastError = err;
            console.error(`[${label}] attempt ${attempt + 1}/${retries + 1} failed:`, (err as Error).message);
        }
    }

    throw lastError;
}