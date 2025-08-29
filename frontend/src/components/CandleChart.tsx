"use client";
import React, { useEffect, useRef } from "react";
import {
  CandlestickSeries,
  createChart,
  ISeriesApi,
  UTCTimestamp,
} from "lightweight-charts";
import { Candles } from "@/types";

const timeConversions = {
  "1m": 1 * 60,
  "15m": 15 * 60,
  "1h": 1 * 60 * 60,
  "1d": 1 * 60 * 60 * 24,
};

interface Props {
  data: Candles[];
}

const CandleChart: React.FC<Props> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const lastCandleRef = useRef<Candles | null>(null);

  const interval = "1m";

  useEffect(() => {
    if (!chartContainerRef.current) return;
    // create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { color: "#151515" },
        textColor: "#777",
      },
      grid: {
        vertLines: { color: "#444" },
        horzLines: { color: "#444" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // cnadle stick addition
    candleSeriesRef.current = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    candleSeriesRef.current.setData(data);
    chart.timeScale().fitContent();

    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);

      const price = Number(data.bid);

      const tsSec = Math.floor(data.time / 1000); 
      const timeStamp = Math.floor(tsSec / 60) * 60;

      const candle = {
        time: timeStamp as UTCTimestamp,
        open:
          lastCandleRef.current?.time === timeStamp
            ? lastCandleRef.current.open
            : price,
        low:
          lastCandleRef.current?.time === timeStamp
            ? Math.min(price, lastCandleRef.current.low)
            : price,
        high:
          lastCandleRef.current?.time === timeStamp
            ? Math.max(price, lastCandleRef.current.high)
            : price,
        close: price,
      };

      lastCandleRef.current = candle;

      if (candleSeriesRef.current) {
        candleSeriesRef.current.update(candle);
      }

      lastCandleRef.current = candle;
      if (candleSeriesRef.current) {
        candleSeriesRef.current.update(candle);
      }
    };
  }, []);

  return (
    <div
      ref={chartContainerRef}
      className="w-2/3 h-full bg-zinc-900 rounded-sm overflow-hidden"
    ></div>
  );
};

export default CandleChart;
