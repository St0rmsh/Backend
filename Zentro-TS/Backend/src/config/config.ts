import dotenv from "dotenv"

dotenv.config()


type ZentroConfig = {
    PORT: number;
    MONGO_URI: string;
    JWT_SECRET: string;
    NODE_ENV: "development" | "production" | "testing";
}

if (!process.env.PORT) {
    throw new Error("PORT is not defined")
}

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined")
}

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined")
}

if (!process.env.NODE_ENV) {
    throw new Error("NODE_ENV is not defined")
}

export const config: ZentroConfig = {
    PORT: process.env.PORT ? Number(process.env.PORT) : 5000,
    MONGO_URI: String(process.env.MONGO_URI),
    JWT_SECRET: String(process.env.JWT_SECRET),
    NODE_ENV: process.env.NODE_ENV || "development"
}

