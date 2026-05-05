import dotenv from "dotenv"

dotenv.config()


if(!process.env.PORT){
    throw new Error("PORT is not defined")
}

if(!process.env.MONGODB_URI){
    throw new Error("MONGODB_URI is not defined")
}

if(!process.env.REDIS_HOST){
    throw new Error("REDIS_HOST is not defined")
}

if(!process.env.REDIS_PASSWORD){
    throw new Error("REDIS_PASSWORD is not defined")
}

if(!process.env.REDIS_PORT){
    throw new Error("REDIS_PORT is not defined")
}

if(!process.env.IMAGEKIT_PRIVATE_KEY){
    throw new Error("IMAGEKIT_PRIVATE_KEY is not defined")
}

if(!process.env.IMAGEKIT_PUBLIC_KEY){
    throw new Error("IMAGEKIT_PUBLIC_KEY is not defined")
}

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not defined")
}

if(!process.env.TAVILY_API_KEY){
    throw new Error("TAVILY_API_KEY is not defined")
}

if(!process.env.MISTRAL_API_KEY){
    throw new Error("MISTRAL_API_KEY is not defined")
}

if(!process.env.ASSEMBLY_API_KEY){
    throw new Error("ASSEMBLY_API_KEY is not defined")
}

if(!process.env.GOOGLE_USER){
    throw new Error("GOOGLE_USER is not defined")
}

if(!process.env.GOOGLE_PASS){
    throw new Error("GOOGLE_PASS is not defined")
}

if(!process.env.IMAGEKIT_URL_ENDPOINT){
    throw new Error("IMAGEKIT_URL_ENDPOINT is not defined")
}

if(!process.env.CLOUDINARY_CLOUD_NAME){
    throw new Error("CLOUDINARY_CLOUD_NAME is not defined")
}

if(!process.env.CLOUDINARY_API_KEY){
    throw new Error("CLOUDINARY_API_KEY is not defined")
}

if(!process.env.CLOUDINARY_API_SECRET){
    throw new Error("CLOUDINARY_API_SECRET is not defined")
}

if(!process.env.GOOGLE_API_KEY){
    throw new Error("GOOGLE_API_KEY is not defined")
}

const config = {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI,
    REDIS_HOST:process.env.REDIS_HOST,
    REDIS_PASSWORD:process.env.REDIS_PASSWORD,
    REDIS_PORT:process.env.REDIS_PORT,
    IMAGEKIT_PRIVATE_KEY:process.env.IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_PUBLIC_KEY:process.env.IMAGEKIT_PUBLIC_KEY,
    JWT_SECRET:process.env.JWT_SECRET,
    TAVILY_API_KEY:process.env.TAVILY_API_KEY,
    MISTRAL_API_KEY:process.env.MISTRAL_API_KEY,
    ASSEMBLY_API_KEY:process.env.ASSEMBLY_API_KEY,
    GOOGLE_USER:process.env.GOOGLE_USER,
    GOOGLE_PASS:process.env.GOOGLE_PASS,
    IMAGEKIT_URL_ENDPOINT:process.env.IMAGEKIT_URL_ENDPOINT,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    GOOGLE_API_KEY:process.env.GOOGLE_API_KEY,
}


export default config