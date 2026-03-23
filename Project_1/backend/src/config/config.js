import dotenv from "dotenv"

dotenv.config()


const config = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGODB_URI,
    REDIS_HOST:process.env.REDIS_HOST,
    REDIS_PASSWORD:process.env.REDIS_PASSWORD,
    REDIS_PORT:process.env.REDIS_PORT,
    IMAGEKIT_PRIVATE_KEY:process.env.IMAGE_KIT_PRIVATE_KEY,
    IMAGEKIT_PUBLIC_KEY:process.env.IMAGE_KIT_PUBLIC_KEY,
    JWT_SECRET:process.env.JWT_SECRET,
    TAVILY_API_KEY:process.env.TAVILY_API_KEY,
    MISTRAL_API_KEY:process.env.MISTRAL_API_KEY,
}


export default config