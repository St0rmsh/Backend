import dotenv from "dotenv"

dotenv.config()


const config = {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI,
    REDIS_HOST:process.env.REDIS_HOST,
    REDIS_PASSWORD:process.env.REDIS_PASSWORD,
    REDIS_PORT:process.env.REDIS_PORT,
    IMAGEKIT_PRIVATE_KEY:process.env.IMAGE_KIT_PRIVATE_KEY,
    IMAGEKIT_PUBLIC_KEY:process.env.IMAGE_KIT_PUBLIC_KEY,
    JWT_SECRET:process.env.JWT_SECRET,
    TAVILY_API_KEY:process.env.TAVILY_API_KEY,
    MISTRAL_API_KEY:process.env.MISTRAL_API_KEY,
    ASSEMBLY_API_KEY:process.env.ASSEMBLY_API_KEY,
    GOOGLE_USER:process.env.GOOGLE_USER,
    GOOGLE_PASS:process.env.GOOGLE_PASS,
    IMAGEKIT_URL_ENDPOINT:process.env.IMAGE_KIT_URL_ENDPOINT,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
}


export default config