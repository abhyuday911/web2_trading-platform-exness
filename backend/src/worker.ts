import Redis from "ioredis";
import { connectDB } from "./db/client";

// --- Redis connection ---
const redis = new Redis(); // default: localhost:6379

// --- Process trades from Redis queue ---
async function processQueue() {
  const client = await connectDB();

  while (true) {
    try {
      const trade = await redis.lpop("trades_queue");
      if (trade) {
        const { symbol, price, qty, time } = JSON.parse(trade);
        // Insert into TimescaleDB
        await client.query(
          "INSERT INTO trades(time, symbol, price, qty) VALUES($1, $2, $3, $4)",
          [new Date(time), symbol, parseFloat(price), parseFloat(qty)]
        );

        console.log(`Inserted trade: ${symbol} ${price} x ${qty}`);
      } else {
        // If queue empty, wait a bit before retrying
        await new Promise((r) => setTimeout(r, 50));
      }
    } catch (error) {
      console.warn(error);
    }
  }
}

processQueue();
