import { MongoClient } from "mongodb";
import config from "../config/config.js";

if (!config.MONGO_URI) {
    throw new Error("MONGODB_URI is not set in environment variables");
}

export const mongoClient = new MongoClient(config.MONGO_URI);

let isConnected = false;

export async function connectMongo() {
    if (isConnected) return mongoClient;

    await mongoClient.connect();
    isConnected = true;
    console.log(" MongoDB connected");

    return mongoClient;
}