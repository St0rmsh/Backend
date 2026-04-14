import dotenv from 'dotenv';

dotenv.config();


if (!process.env.JWT_SECRET ) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
}

if (!process.env.MONGODB_URI ) {
    throw new Error('MONGODB_URI is not defined in the environment variables');
}

if (!process.env.PORT ) {
    throw new Error('PORT is not defined in the environment variables');
}

if (!process.env.GOOGLE_CLIENT_ID ) {
    throw new Error('GOOGLE_CLIENT_ID is not defined in the environment variables');
}

if (!process.env.GOOGLE_SECRET ) {
    throw new Error('GOOGLE_SECRET is not defined in the environment variables');
}

if (!process.env.IMAGEKIT_PRIVATE_KEY ) {
    throw new Error('IMAGEKIT_PRIVATE_KEY is not defined in the environment variables');
}


export const config = {
    JWT_SECRET: process.env.JWT_SECRET,
    MONGODB_URI: process.env.MONGODB_URI,
    PORT: process.env.PORT || 5000 || 8000 || 8080,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    NODE_ENV: process.env.NODE_ENV || 'development',
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
};