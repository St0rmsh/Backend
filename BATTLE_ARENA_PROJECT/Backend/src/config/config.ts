import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),

  GOOGLE_API_KEY: z.string().min(1, "GOOGLE_API_KEY is required"),

  MISTRAL_API_KEY: z.string().min(1, "MISTRAL_API_KEY is required"),

  COHERE_API_KEY: z.string().min(1, "COHERE_API_KEY is required"),

  TAVILY_API_KEY: z.string().min(1, "TAVILY_API_KEY is required"),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("\n❌ Invalid Environment Variables\n");

  console.error(parsed.error.format());

  process.exit(1);
}

const config = parsed.data;

export default config;