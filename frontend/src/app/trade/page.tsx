import CandleChart from "@/components/CandleChart";
import Instruments from "@/components/Instruments";
import { BackendCandle, Candles } from "@/types";
import { UTCTimestamp } from "lightweight-charts";

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
    <div className="p-4 w-screen h-screen flex  gap-4">
      <CandleChart data={transformCandleData(data.candles)} />
      <div className="flex flex-col w-1/3 h-full rounded-sm overflow-hidden gap-2">
        <div className="w-full h-16 bg-zinc-800"></div>
        <div className="w-full p-2 mb-1 bg-zinc-800">
          <Instruments />
        </div>
        <div className="h-full w-full bg-zinc-800"></div>
      </div>
    </div>
  );
};

export default page;
