import dotenv from "dotenv"
dotenv.config()


if (!process.env.PORT) {
        throw new Error("PORT is undifiend")
}

if (!process.env.MONGO_URI) {
    throw new Error("Mongo Uri is undifiend")
}

if (!process.env.NODE_ENV) {
    throw new Error("NODE_ENV is undifiend")
}

if (!process.env.GOOGLE_PASS) {
     throw new Error("GOOGLE_PASS is undifiend")
}

if (!process.env.GOOGLE_USER) {
     throw new Error("GOOGLE_USER is undifiend")
}

if(!process.env.ACCESS_TOKEN){
    throw new Error("ACCESS_TOKEN is undefined")
}

if(!process.env.REFRESH_TOKEN){
    throw new Error("REFRESH_TOKEN is undefined")
}

if(!process.env.REDIS_HOST){
    throw new Error("REFRESH_TOKEN is undefined")
}

if(!process.env.REDIS_PASSWORD){
    throw new Error("REFRESH_TOKEN is undefined")
}

if(!process.env.REDIS_PORT){
    throw new Error("REDIS_PORT is undefined")
}


if(!process.env.IMAGEKIT_PUBLIC_KEY){
    throw new Error("REDIS_PORT is undefined")
}

if(!process.env.IMAGEKIT_PRIVATE_KEY){
    throw new Error("REDIS_PORT is undefined")
}


const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    NODE_ENV: process.env.NODE_ENV,
    GOOGLE_PASS: process.env.GOOGLE_PASS,
    GOOGLE_USER: process.env.GOOGLE_USER,
    ACCESS_TOKEN: process.env.ACCESS_TOKEN,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    TRUST_PROXY: process.env.TRUST_PROXY === "true",
}

export default config