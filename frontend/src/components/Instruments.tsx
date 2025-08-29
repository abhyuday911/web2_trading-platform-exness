"use client";
import { Trade } from "@/types";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const Instruments = () => {
  const [latestTrade, setLatestTrade] = useState<Trade>();
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      console.log("hello");
    };

    ws.onmessage = (event) => {
      const Trade = JSON.parse(event.data);
      setLatestTrade(Trade);
    };
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Symbole</TableHead>
          <TableHead>Bid</TableHead>
          <TableHead>Ask</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="w-1/3">
            {latestTrade?.symbol || "connection NA"}
          </TableCell>
          <TableCell className="w-1/3">
            {Number(latestTrade?.bid) || "connection NA"}
          </TableCell>
          <TableCell className="w-1/3">
            {Number(latestTrade?.ask) || "connection NA"}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="w-1/3">{"Eth"}</TableCell>
          <TableCell className="w-1/3">
            {Number(latestTrade?.bid) || "connection NA"}
          </TableCell>
          <TableCell className="w-1/3">
            {Number(latestTrade?.ask) || "connection NA"}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default Instruments;
