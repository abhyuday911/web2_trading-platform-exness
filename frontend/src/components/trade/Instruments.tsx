"use client";
import { Trade } from "@/types";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

type InstrumentProps = {
  latestTrade: Trade;
};

const Instruments = ({ latestTrade }: InstrumentProps) => {
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
            {(
              Number(latestTrade?.bid) / 20 +
              Math.floor(Math.random() * 10)
            ).toFixed(2) || "connection NA"}
          </TableCell>
          <TableCell className="w-1/3">
            {(
              Number(latestTrade?.ask) / 20 +
              Math.floor(Math.random() * 10)
            ).toFixed(2) || "connection NA"}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default Instruments;
