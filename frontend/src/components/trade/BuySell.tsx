import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trade } from "@/types";
import { PositionsTable } from "./PositionsTable";
import { ScrollArea } from "../ui/scroll-area";

type BuySellProps = {
  latestTrade: Trade | undefined;
};

const BuySell = ({ latestTrade }: BuySellProps) => {
  const leverageOptions = [1, 2, 3, 5, 10];
  const [quantity, setQuantity] = useState<string | number>("");
  const [orderType, setOrderType] = useState<"market" | "limit" | "openTrades">(
    "market"
  );
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
        <Tabs
          defaultValue="market"
          className="h-full"
          onValueChange={(value) =>
            setOrderType(value as "market" | "limit" | "openTrades")
          }
        >
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
            <div className="space-y-4 h-full">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  Bid:{" "}
                  <span className="text-green-500">
                    {Number(latestTrade?.bid).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) || "connection NA"}
                  </span>
                </span>
                <span>
                  Ask:{" "}
                  <span className="text-red-500">
                    {Number(latestTrade?.ask).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) || "connection NA"}
                  </span>
                </span>
              </div>
              {orderType != "market" && (
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    placeholder="Enter Price"
                    type="number"
                    // value={""}
                    // onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>
              )}
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stopLoss">Stop Loss</Label>
                  <Input id="stopLoss" placeholder="Stop loss" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="takeProfit">Take Profit</Label>
                  <Input
                    id="takeProfit"
                    placeholder="Take profit"
                    type="number"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  variant="default"
                  className="bg-green-500 hover:bg-green-600 cursor-pointer"
                >
                  Buy $
                  {latestTrade && !isNaN(Number(quantity))
                    ? (
                        (latestTrade.ask / leverage) *
                        Number(quantity)
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "--"}
                </Button>

                <Button
                  variant="destructive"
                  className="bg-red-500 hover:bg-red-600 cursor-pointer"
                >
                  Sell $
                  {latestTrade && !isNaN(Number(quantity))
                    ? (
                        (latestTrade.bid / leverage) *
                        Number(quantity)
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "--"}
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="limit">
            <div className="space-y-4 h-full">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  Bid:{" "}
                  <span className="text-green-500">
                    {Number(latestTrade?.bid).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) || "connection NA"}
                  </span>
                </span>
                <span>
                  Ask:{" "}
                  <span className="text-red-500">
                    {Number(latestTrade?.ask).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) || "connection NA"}
                  </span>
                </span>
              </div>
              {orderType != "market" && (
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    placeholder="Enter Price"
                    type="number"
                    // value={""}
                    // onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>
              )}
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stopLoss">Stop Loss</Label>
                  <Input id="stopLoss" placeholder="Stop loss" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="takeProfit">Take Profit</Label>
                  <Input
                    id="takeProfit"
                    placeholder="Take profit"
                    type="number"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  variant="default"
                  className="bg-green-500 hover:bg-green-600 cursor-pointer"
                >
                  Buy $
                  {latestTrade && !isNaN(Number(quantity))
                    ? (
                        latestTrade.ask /
                        leverage /
                        Number(quantity)
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })
                    : "--"}
                </Button>

                <Button
                  variant="destructive"
                  className="bg-red-500 hover:bg-red-600 cursor-pointer"
                >
                  Sell $
                  {latestTrade && !isNaN(Number(quantity))
                    ? (
                        latestTrade.bid /
                        leverage /
                        Number(quantity)
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })
                    : "--"}
                </Button>
              </div>
            </div>
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
