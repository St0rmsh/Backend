import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.PORT || 5000,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || '',
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || '',
    COHERE_API_KEY: process.env.COHERE_API_KEY || '',
    TAVILY_API_KEY: process.env.TAVILY_API_KEY || '',
    MONGO_URI: process.env.MONGO_URI || '',
};

const requiredKeys: (keyof typeof config)[] = [
    'GOOGLE_API_KEY',
    'MISTRAL_API_KEY',
    'COHERE_API_KEY',
    'TAVILY_API_KEY',
    'MONGO_URI',
];

for (const key of requiredKeys) {
    if (!config[key]) {
        console.warn(`⚠️  Missing environment variable: ${key === 'MONGO_URI' ? 'MONGODB_URI' : key}`);
    }
}

export default config;