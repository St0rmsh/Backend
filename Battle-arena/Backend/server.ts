import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import app from './src/app.js';
import config from './src/config/config.js';
import { connectMongo } from './src/db/mongo.client.js';


async function start() {
    try {
        await connectMongo();

        app.listen(config.port, () => {
            console.log(` Server is running on port ${config.port}`);
        });
    } catch (error) {
        console.error(" Failed to start server:", error);
        process.exit(1);
    }
}

start();