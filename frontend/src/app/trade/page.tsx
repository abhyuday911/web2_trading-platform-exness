import User from "@/components/auth/User";
import CandleChart from "@/components/CandleChart";
import Instruments from "@/components/trade/Instruments";
import BuySell from "@/components/trade/BuySell";
import { BackendCandle, Candles } from "@/types";
import { UTCTimestamp } from "lightweight-charts";
import TradeActivities from "@/components/trade/TradeActivities";

async function getCandles() {
  try {
    const res = await fetch(
      "http://localhost:3030/candles?asset=BTCUSDT&duration=1m",
      {
        cache: "no-store",
      }
    );
    return res.json();
  } catch (error) {
    console.error(error);
    return { candles: [] };
  }
}

const transformCandleData = (data: BackendCandle[]): Candles[] => {
  return data
    .map((candle) => ({
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      time: Math.floor(
        new Date(candle.bucket).getTime() / 1000
      ) as UTCTimestamp,
    }))
    .sort((a, b) => a.time - b.time);
};

const page = async () => {
  const data = await getCandles();

  return (
    <div className="p-4 w-screen h-screen flex gap-4">
      <CandleChart data={transformCandleData(data.candles)} />
      <TradeActivities />
    </div>
  );
};

export default page;
