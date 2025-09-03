import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trade } from "@/types";

type BuySellProps = {
  latestTrade: Trade | undefined;
};

const BuySell = ({ latestTrade }: BuySellProps) => {
  const leverageOptions = [1, 2, 3, 5, 10];
  const [quantity, setQuantity] = useState<string | number>("");
  const [leverageIndex, setLeverageIndex] = useState(0);
  const leverage = leverageOptions[leverageIndex];

  return (
    <>
      <div className="space-y-4 p-3">
        <Tabs defaultValue="market">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="limit">Limit</TabsTrigger>
          </TabsList>
          <TabsContent value="market" />
          <TabsContent value="limit" />
        </Tabs>

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Bid:{" "}
            <span className="text-green-500">
              {Number(latestTrade?.bid) || "connection NA"}
            </span>
          </span>
          <span>
            Ask:{" "}
            <span className="text-red-500">
              {Number(latestTrade?.ask) || "connection NA"}
            </span>
          </span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            placeholder="Enter quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        {/* --- Leverage Selector --- */}
        <div className="space-y-2">
          <Label htmlFor="leverage">Leverage</Label>
          <input
            id="leverage"
            type="range"
            min={0}
            max={leverageOptions.length - 1}
            step={1}
            value={leverageIndex}
            onChange={(e) => setLeverageIndex(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            {leverageOptions.map((val, idx) => (
              <span
                key={val}
                className={
                  idx === leverageIndex ? "font-bold text-blue-600" : ""
                }
              >
                {val}x
              </span>
            ))}
          </div>
        </div>
        {/* --- End Leverage --- */}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stopLoss">Stop Loss</Label>
            <Input id="stopLoss" placeholder="Stop loss" type="number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="takeProfit">Take Profit</Label>
            <Input id="takeProfit" placeholder="Take profit" type="number" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button variant="default" className="bg-green-500 hover:bg-green-600">
            Buy $
            {latestTrade && !isNaN(Number(quantity))
              ? ((latestTrade.ask / leverage) * Number(quantity)).toFixed(2)
              : "--"}
          </Button>

          <Button variant="destructive" className="bg-red-500 hover:bg-red-600">
            Sell $
            {latestTrade && !isNaN(Number(quantity))
              ? ((latestTrade.bid / leverage) * Number(quantity)).toFixed(2)
              : "--"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default BuySell;
