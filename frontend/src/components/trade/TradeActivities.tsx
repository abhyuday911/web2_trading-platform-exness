"use client";
import React, { useEffect, useState } from "react";
import BuySell from "./BuySell";
import User from "../auth/User";
import Instruments from "./Instruments";
import { Trade } from "@/types";

const TradeActivities = () => {
  const [latestTrade, setLatestTrade] = useState<Trade>();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      console.log("hello");
    };

    ws.onmessage = (event) => {
      const Trade: Trade = JSON.parse(event.data);
      setLatestTrade(Trade);
    };
  }, []);

  return (
    <div className="flex flex-col w-1/3 h-full rounded-sm overflow-hidden gap-2">
      <div className="w-full p-2 bg-neutral-900 flex items-end justify-end gap-2">
        <User />
      </div>
      <div className="w-full p-2 mb-1 bg-neutral-900">
        {latestTrade && <Instruments latestTrade={latestTrade} />}
      </div>
      <div className="h-full w-full bg-neutral-900">
        <BuySell latestTrade={latestTrade}/>
      </div>
    </div>
  );
};

export default TradeActivities;
