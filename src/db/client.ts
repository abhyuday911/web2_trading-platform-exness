import { Client } from "pg";

let client: Client | null = null;

export async function connectDB() {
  if (!client) {
    client = new Client({
      host: "localhost",
      port: 5432,
      user: "postgres",
      password: "postgres",
      database: "prices",
    });

    await client.connect();
    console.log("✅ Connected to TimescaleDB");
  }

  return client;
}
