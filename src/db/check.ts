import { connectDB } from "./client";

async function checkDB() {
  const client = await connectDB();

  console.log("=== Checking Trades Table ===");
  const trades = await client.query("SELECT * FROM trades ORDER BY time DESC LIMIT 50;");
  if (trades.rows.length === 0) {
    console.log("⚠️ No trades found in trades table.");
  } else {
    console.table(trades.rows);
  }

  const candleTables = [
    { name: "candles_1m", label: "1-Minute Candles" },
    { name: "candles_15m", label: "15-Minute Candles" },
    { name: "candles_1h", label: "1-Hour Candles" },
    { name: "candles_1d", label: "1-Day Candles" },
  ];

  for (const { name, label } of candleTables) {
    console.log(`\n=== Checking ${label} ===`);
    try {
      const result = await client.query(
        `SELECT * FROM ${name} ORDER BY bucket DESC LIMIT 50;`
      );
      console.log(result.rows.length)
      if (result.rows.length === 0) {
        console.log(`⚠️ No rows found in ${name}.`);
      } else {
        console.table(result.rows);
      }
    } catch (err) {
      console.log(`❌ Could not query ${name}:`, err.message);
    }
  }

  await client.end();
}

checkDB().catch((err) => {
  console.error("❌ Error checking DB:", err);
});
