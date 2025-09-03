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
interface User {
  email: string;
  password: string;
  balance: Balance;
  userId: string | number;
  positions: Position[];
}
