import "dotenv/config";


if (!process.env.ACCESS_TOKEN ) {
    throw new Error("Access token is required");
}

if (!process.env.REFRESH_TOKEN ) {
    throw new Error("Refresh token is required");
}

if (!process.env.PORT) {
    throw new Error("Port is required");
}


if (!process.env.MONGODB_URI) {
    throw new Error("MongoDB URI is required");
}

const config = {
    port: process.env.PORT,
    accessToken: process.env.ACCESS_TOKEN,
    refreshToken: process.env.REFRESH_TOKEN,
    mongoUri: process.env.MONGODB_URI
};

export default config;
