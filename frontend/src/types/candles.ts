import { UTCTimestamp } from "lightweight-charts";

export interface Candles {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface BackendCandle {
  bucket: string; // e.g. "2025-08-28T08:45:00.000Z"
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Trade {
  symbol: string;
  bid: number;
  ask: number;
  qty: number;
  time: number
}
