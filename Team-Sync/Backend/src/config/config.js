import dotenv from "dotenv";

dotenv.config();


if (!process.env.PORT) {
    throw new Error("Please provide PORT ");
}

if (!process.env.MONGODB_URI) {
        throw new Error("Please provide Mongo_uri ");

}

export const Config = {
    
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGODB_URI
    
};