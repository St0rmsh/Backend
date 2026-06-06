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


const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    NODE_ENV: process.env.NODE_ENV,
    GOOGLE_PASS: process.env.GOOGLE_PASS,
    GOOGLE_USER: process.env.GOOGLE_USER,
    ACCESS_TOKEN: process.env.ACCESS_TOKEN,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN
}

export default config