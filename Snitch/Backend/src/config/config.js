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

if (!process.env.REDIS_HOST ) {
    throw new Error('REDIS_HOST is not defined in the environment variables');
}

if (!process.env.REDIS_PORT ) {
    throw new Error('REDIS_PORT is not defined in the environment variables');
}

if (!process.env.REDIS_PASSWORD ) {
    throw new Error('REDIS_PASSWORD is not defined in the environment variables');
}

if (!process.env.RAZORPAY_KEY_ID ) {
    throw new Error('RAZORPAY_KEY_ID is not defined in the environment variables');
}

if (!process.env.RAZORPAY_KEY_SECRET ) {
    throw new Error('RAZORPAY_KEY_SECRET is not defined in the environment variables');
}

export const config = {
    JWT_SECRET: process.env.JWT_SECRET,
    MONGODB_URI: process.env.MONGODB_URI,
    PORT: process.env.PORT || 5000 || 8000 || 8080,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    NODE_ENV: process.env.NODE_ENV || 'development',
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
};