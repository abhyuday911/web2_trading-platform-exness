import { connectDB } from "./client";

async function setup() {
  const client = await connectDB();
  await client.query(`CREATE EXTENSION IF NOT EXISTS timescaledb;`);

  await client.query(`
    CREATE TABLE IF NOT EXISTS trades (
      time TIMESTAMPTZ NOT NULL,
      symbol TEXT NOT NULL,
      price DOUBLE PRECISION NOT NULL,
      qty DOUBLE PRECISION NOT NULL
    );
  `);

  await client.query(`
    SELECT create_hypertable('trades', 'time', if_not_exists => TRUE);
  `);

  console.log("✅ trades hypertable ready");

  const intervals = [
    {
      name: "candles_1m",
      sqlInterval: "1 minute",
      scheduleInterval: "1 minute",
    },
    {
      name: "candles_15m",
      sqlInterval: "15 minutes",
      scheduleInterval: "10 minutes",
    },
    {
      name: "candles_1h",
      sqlInterval: "1 hour",
      scheduleInterval: "30 minutes",
    },
    {
      name: "candles_1d",
      sqlInterval: "1 day",
      scheduleInterval: "30 minutes",
    },
  ];

  for (const { name, sqlInterval, scheduleInterval } of intervals) {
    await client.query(``);
    await client.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS ${name}
        WITH (timescaledb.continuous) AS
        SELECT time_bucket('${sqlInterval}', time) AS bucket,
            symbol,
            first(price,time) AS open,
            MAX(price) AS high,
            MIN(price) AS low,
            last(price,time) AS close,
            SUM(qty) AS volume
        FROM trades
        GROUP BY bucket, symbol;
        `);

    console.log(`✅ Created continuous aggregate: ${name}`);

    // Backfill historical data
    await client.query(
      `CALL refresh_continuous_aggregate('${name}',NULL ,NULL )`
    );
    console.log(`🔄 Backfilled data for: ${name}`);

    try {
      // remove if any pre-existing policy

      await client.query(`
        SELECT remove_continuous_aggregate_policy('${name}', if_exists => TRUE);
      `);

      // automatic refresh policy
      let startOffset = sqlInterval === "1 day" ? "7 days" : "1 day";
      await client.query(`
        SELECT add_continuous_aggregate_policy(
        '${name}',
        start_offset => INTERVAL '${startOffset}',
        end_offset => INTERVAL '${sqlInterval}',
        schedule_interval => INTERVAL '${scheduleInterval}')
    `);
      console.log(`⏱️ Auto-refresh policy added for: ${name}`);
    } catch (error) {
      console.warn(error);
    }
  }

  await client.end();
  console.log("🎉 DB setup complete");
}

setup().catch((err) => {
  console.error("❌ Setup failed:", err);
  process.exit(1);
});
