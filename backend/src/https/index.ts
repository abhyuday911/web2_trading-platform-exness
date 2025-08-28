import express from "express";
import { connectDB } from "../db/client";
import { z } from "zod";

const app = express();
app.use(express.json());
const client = await connectDB();
const PORT = process.env.PORT || 3000;

app.get("/index", (req, res) => console.log("first"));

const candleQuerySchema = z.object({
  asset: z.string().min(1),
  duration: z
    .string()
    .regex(/^\d+[mhd]$/, "duration must be like 1m, 15m, 2h, 1d"),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

// ✅ Duration to table mapping
const durationMap: Record<string, string> = {
  "1m": "candles_1m",
  "15m": "candles_15m",
  "30m": "candles_30m",
  "1d": "candles_1d",
};

// ✅ API endpoint
app.get("/candles", async (req, res) => {
  try {
    const parsed = candleQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
    }

    const { asset, duration, startTime, endTime } = parsed.data;

    let tableName = durationMap[duration];
    let query: string;
    let params: any[] = [asset];

    if (tableName) {
      // Use precomputed continuous aggregate
      query = `
        SELECT bucket, symbol, open, high, low, close, volume
        FROM ${tableName}
        WHERE symbol = $1
        LIMIT 50;
      `;
    } else {
      // Fallback: aggregate dynamically from 1m candles
      query = `
        SELECT time_bucket('${duration}', bucket) as time,
               symbol,
               first(open, bucket) as open,
               max(high) as high,
               min(low) as low,
               last(close, bucket) as close,
               sum(volume) as volume
        FROM candles_1m
        WHERE symbol = $1
      `;
    }

    if (startTime) {
      params.push(new Date(Number(startTime)));
      query += ` AND bucket >= $${params.length}`;
    }

    if (endTime) {
      params.push(new Date(Number(endTime)));
      query += ` AND bucket <= $${params.length}`;
    }

    // query += ` GROUP BY time, symbol ORDER BY time ASC;`;

    const result = await client.query(query, params);

    res.json({
      asset,
      duration,
      count: result.rows.length,
      candles: result.rows,
    });
  } catch (err) {
    console.error(Math.random(), err);
    res.status(500).json({ error: "Internal server error",random: Math.random() });
  }
});

app.listen(PORT, () => console.log("app running at 3000"));
