import amqplib from "amqplib"

const QUEUE = "auth_notification_queue"

let channel = null;

const connectWithRetry = async (retries = 5, delay = 5000) => {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`[MQ] Connecting to RabbitMQ... attempt ${i + 1}`);
            const connection = await amqplib.connect(process.env.RABBITMQ_URL);

            connection.on('error', (err) => {
                console.error('[MQ] Connection error:', err.message);
            });

            connection.on('close', () => {
                console.error('[MQ] Connection closed, retrying...');
                setTimeout(connectWithRetry, delay);
            });

            channel = await connection.createChannel();
            await channel.assertQueue(QUEUE, { durable: true });
            console.log('[MQ] Connected and queue ready ✓');
            return channel;

        } catch (err) {
            console.error(`[MQ] Failed to connect: ${err.message}`);
            if (i < retries - 1) {
                console.log(`[MQ] Retrying in ${delay / 1000}s...`);
                await new Promise(res => setTimeout(res, delay));
            }
        }
    }
    console.error('[MQ] All retries exhausted, continuing without RabbitMQ');
}

await connectWithRetry();

export default channel;