const { QueueClient } = require("@azure/storage-queue");
const mysql = require("mysql2/promise");

const QUEUE_NAME = "order-queue";
const connectionString = process.env.STORAGE_CONNECTION_STRING;

if (!connectionString) {
  console.error("FATAL: STORAGE_CONNECTION_STRING is not set.");
  process.exit(1);
}

const queueClient = new QueueClient(connectionString, QUEUE_NAME);

let isRunning = true;

process.on("SIGTERM", () => {
  console.log("shutting down...");
  isRunning = false;
});

async function startWorker() {
  console.log("Connecting to Database...");

  const db = await mysql.createPool({
    connectionLimit: 5,
    host: process.env.HOST || "localhost",
    user: process.env.USER || "mysqladmin",
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    ssl: (process.env.HOST && process.env.HOST !== "localhost" && process.env.HOST !== "db")
      ? { rejectUnauthorized: false }
      : undefined
  });

  await queueClient.createIfNotExists();
  console.log(`Listening for messages on queue: '${QUEUE_NAME}'...`);

  while (isRunning) {
    try {
      const response = await queueClient.receiveMessages({
        numberOfMessages: 1,
        visibilityTimeout: 30
      });

      if (response.receivedMessageItems.length === 0) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        continue;
      }

      const message = response.receivedMessageItems[0];
      console.log(`Processing message ID: ${message.messageId}`);

      const rawText = Buffer.from(message.messageText, "base64").toString("utf-8");
      const task = JSON.parse(rawText);

      const sql = "INSERT INTO cart (item, amount, user) VALUES (?, ?, ?)";
      await db.execute(sql, [task.itemid, task.amount, task.user]);

      console.log(`Successfully wrote to DB for User: ${task.user}`);

      await queueClient.deleteMessage(message.messageId, message.popReceipt);
      console.log(`Message ${message.messageId} deleted from queue.`);
    } catch (err) {
      console.error("Error processing queue message:", err.message);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  await db.end();
  console.log("Worker cleanly stopped.");
  process.exit(0);
}

startWorker().catch((err) => {
  console.error("Worker fatal startup error:", err);
  process.exit(1);
});