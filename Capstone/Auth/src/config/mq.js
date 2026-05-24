import amqplib from "amqplib";

const QUEUE = "auth_notification_queue";

let channel = null;
let retryTimeout = null;

async function connect() {
  try {
    console.log("[MQ] Connecting to RabbitMQ...");
    const connection = await amqplib.connect(process.env.RABBITMQ_URL);

    connection.on("error", (err) => {
      console.error("[MQ] Connection error:", err.message);
      
      channel = null;

      scheduleReconnect();
    });


    connection.on("close", () => {
      console.warn("[MQ] Connection closed — reconnecting...");
      channel = null;
      scheduleReconnect();
    });

    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE, { durable: true });

    console.log("[MQ] Connected and queue ready ✓");

    if (retryTimeout) {
      clearTimeout(retryTimeout);
      retryTimeout = null;
    }
  } catch (err) {
    console.error("[MQ] Failed to connect:", err.message);
    channel = null;
    scheduleReconnect();
  }
}

function scheduleReconnect() {
  if (retryTimeout) return;
  retryTimeout = setTimeout(() => {
    retryTimeout = null;
    connect();
  }, 5000); // retry every 5 seconds
}

export async function sendAuthNotification(message) {
  if (!channel) {
    console.warn("[MQ] Channel not ready — message dropped:", message);
    return; // don't crash, just skip
  }

  channel.sendToQueue(
    QUEUE,
    Buffer.from(JSON.stringify(message)),
    { persistent: true }
  );

  console.log("[MQ] Message sent to queue:", message);
}

// connect on startup but don't block or crash
connect();