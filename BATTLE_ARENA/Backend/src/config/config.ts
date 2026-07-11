import dotenv from "dotenv";

dotenv.config();

const config = {
  // BUG FIX: was 5000 by default while the frontend called :3000. Now both agree (see .env.example).
  port: Number(process.env.PORT) || 3000,
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",

  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
  MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || "",
  COHERE_API_KEY: process.env.COHERE_API_KEY || "",
  TAVILY_API_KEY: process.env.TAVILY_API_KEY || "",

  // How many past exchanges (user turn + judged result) to keep in memory per session.
  memoryTurns: Number(process.env.MEMORY_TURNS) || 8, // within the 5-10 range requested
};

// NEW: fail fast with a clear message instead of the app silently sending empty API keys
// to Mistral/Cohere/Google and crashing deep inside a graph node with a cryptic 401.
const required = ["GOOGLE_API_KEY", "MISTRAL_API_KEY", "COHERE_API_KEY"] as const;
const missing = required.filter((key) => !config[key]);
if (missing.length > 0) {
  console.warn(
    `⚠️  Missing environment variables: ${missing.join(", ")}. ` +
      `Requests that need them will fail until you set them in .env.`
  );
}

export default config;