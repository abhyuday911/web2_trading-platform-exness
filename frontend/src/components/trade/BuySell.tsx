import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trade } from "@/types";
import { PositionsTable } from "./PositionsTable";
import { ScrollArea } from "../ui/scroll-area";
import MarketOrder from "./order-forms/MarketOrder";
import LimitOrder from "./order-forms/LimitOrder";

export type BuySellProps = {
  latestTrade: Trade | undefined;
};

const BuySell = ({ latestTrade }: BuySellProps) => {
  const leverageOptions = [1, 2, 3, 5, 10];
  const [quantity, setQuantity] = useState<string | number>("");
  const [leverageIndex, setLeverageIndex] = useState(0);
  const leverage = leverageOptions[leverageIndex];

  const [positions, setPositions] = useState([
    { id: "1012", symbol: "BTC", side: "buy" as const, size: 0.015, pnl: 14.3 },
    {
      id: "1013",
      symbol: "BTC",
      side: "sell" as const,
      size: 0.008,
      pnl: -3.2,
    },
    { id: "1017", symbol: "BTC", side: "buy" as const, size: 0.025, pnl: 27.6 },
    { id: "1019", symbol: "BTC", side: "sell" as const, size: 0.012, pnl: 6.7 },
    { id: "1023", symbol: "BTC", side: "buy" as const, size: 0.01, pnl: -1.5 },
    { id: "1025", symbol: "BTC", side: "sell" as const, size: 0.05, pnl: 42.8 },
    { id: "1030", symbol: "BTC", side: "buy" as const, size: 0.02, pnl: 18.1 },
    {
      id: "1033",
      symbol: "BTC",
      side: "sell" as const,
      size: 0.006,
      pnl: -4.4,
    },
  ]);

  const closePosition = (id: string) => {
    setPositions(positions.filter((p) => p.id !== id));
  };

  return (
    <>
      <div className="space-y-4 p-3 h-full">
        <Tabs defaultValue="market" className="h-full">
          <TabsList className="w-full bg-transparent flex justify-between">
            <TabsList className="grid grid-cols-2 w-1/2">
              <TabsTrigger value="market">Market</TabsTrigger>
              <TabsTrigger value="limit">Limit</TabsTrigger>
            </TabsList>
            <TabsList className=" w-1/2 ml-8">
              <TabsTrigger value="openTrades" className="col-start-2">
                Open Trades
              </TabsTrigger>
            </TabsList>
          </TabsList>

          <TabsContent value="market">
            <MarketOrder
              latestTrade={latestTrade}
              quantity={quantity}
              setQuantity={setQuantity}
              leverageIndex={leverageIndex}
              leverageOptions={leverageOptions}
              leverage={leverage}
              setLeverageIndex={setLeverageIndex}
            />
          </TabsContent>
          <TabsContent value="limit">
            <LimitOrder
              latestTrade={latestTrade}
              quantity={quantity}
              setQuantity={setQuantity}
              leverageIndex={leverageIndex}
              leverageOptions={leverageOptions}
              leverage={leverage}
              setLeverageIndex={setLeverageIndex}
            />
          </TabsContent>
          <TabsContent value="openTrades" className="overflow-auto h-full pt-2">
            <ScrollArea className="h-full w-full">
              <PositionsTable positions={positions} onClose={closePosition} />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default BuySell;
