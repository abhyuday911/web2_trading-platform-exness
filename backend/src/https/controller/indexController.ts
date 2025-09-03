import type { Request, Response } from "express";
import z from "zod";
import { connectDB } from "../../db/client";
import jwt, { decode, type JwtPayload } from "jsonwebtoken";
import type { AuthRequest } from "../middleware/isLoggedIn";
import Redis from "ioredis";
const bcrypt = require("bcrypt");
const redis = new Redis({ host: "127.0.0.1", port: 6379 });

const JWT_KEY = process.env.JWT_KEY || "whatsUpHomie";
const client = await connectDB();

interface MyJwtPayload extends JwtPayload{
  email: string
}

interface Balance {
  usd: number;
  [asset: string]: number;
}

interface Position {
  asset: string;
  qty: number;
  entryPrice: number;
  leverage: number;
  margin: number;
  type: "buy" | "sell";
  stoploss?: number;
  takeProfit?: number;
}


class User {
  email: string;
  password: string;
  balance: Balance;
  userId: string | number;
  positions: Position[];

  constructor(email: string, password: string, userId?: string | number) {
    this.email = email;
    this.password = password;
    this.balance = { usd: 100000 };
    this.userId = userId ?? Date.now();
    this.positions = [];
  }

  // == balance stuff == //
  updateBalance(amount: number) {
    if (this.balance.usd + amount < 0) {
      throw new Error("insufficient balance");
    }
    this.balance.usd += amount;
  }

  getBalance(): number {
    return this.balance.usd;
  }

  // == crypto stuff == //
  addCrypto = (asset: string, qty: number) => {
    if (!this.balance[asset]) this.balance[asset] = 0;
    this.balance[asset] += qty;
  };
  getCrypto = (asset: string): number => {
    return this.balance[asset] || 0;
  };

  // == (open - close) positions == //
  openPosition = (position: Position) => {
    if (this.balance.usd < position.margin) {
      throw new Error("insufficient balance");
    }
    this.balance.usd -= position.margin;
    this.positions.push(position);
  };

  closePosition = (index: number, pnl: number) => {
    const position = this.positions[index];
    if (!position) throw new Error("position not found");

    // this part is garbage, we'll see to it later.
    this.balance.usd += position.margin + pnl;
    this.positions.splice(index, 1);
  };
}

const Users = new Map();

const durationMap: Record<string, string> = {
  "1m": "candles_1m",
  "15m": "candles_15m",
  "30m": "candles_30m",
  "1d": "candles_1d",
};

const candleQuerySchema = z.object({
  asset: z.string().min(1),
  duration: z
    .string()
    .regex(/^\d+[mhd]$/, "duration must be like 1m, 15m, 2h, 1d"),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

export const getCandles = async (req: Request, res: Response) => {
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
      query = `
        SELECT bucket, symbol, open, high, low, close, volume
        FROM ${tableName}
        WHERE symbol = $1
        ORDER BY bucket DESC
        LIMIT 100;
      `;
    } else {
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
    res
      .status(500)
      .json({ error: "Internal server error", random: Math.random() });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) res.json("user not loggedin");

  try {
    const decoded = jwt.verify(token, JWT_KEY) as MyJwtPayload;
    const user = Users.get(decoded.email)
    
    if(!user) {
      return res.status(401).json({message: "session invalid log-in again"})
    }


    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

export const signUp = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 11);

  const user = new User(email, hashedPassword);
  Users.set(email, user);

  const token = jwt.sign({ email: email }, JWT_KEY!, { expiresIn: "1d" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  return res.status(201).json({ message: "User created", user });
};

export const signIn = (req: Request, res: Response) => {
  const { email, password } = req.body;
  res.json({ email, password });
};

export const order = async (req: AuthRequest, res: Response) => {
  const user: User = Users.get(req.user.email);

  if (!user) {
    return res.status(401).json("user not found");
  }
  const { type, qty, leverage, asset, stoploss, takeProfit } = req.body;
  const entryPriceStr = await redis.get(`BTCUSDT:latestPrice`);

  if (!entryPriceStr) {
    return res.status(500).json({ message: "entry price not available" });
  }

  const entryPrice = parseFloat(entryPriceStr);
  const requiredMargin = qty * entryPrice;

  if (user.getBalance() < requiredMargin) {
    res.status(400).json({ message: "insufficient balance" });
  }

  user.updateBalance(-requiredMargin);
  user.addCrypto(asset, qty);

  user.openPosition({
    asset,
    qty,
    entryPrice,
    leverage,
    margin: requiredMargin,
    type,
    stoploss,
    takeProfit,
  });

  return res.json({ user: Users.get(req.user.email), price: entryPrice });
};

export const getUserOrders = (req: Request, res: Response) => {
  return res.json("hello bhaya");
};

export const closeUserOrders = (req: Request, res: Response) => {
  return res.json("hello bhaya close order");
};
