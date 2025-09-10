// components/positions-table.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "../ui/scroll-area";

type Position = {
  id: string;
  symbol: string;
  side: "buy" | "sell";
  size: number;
  pnl: number;
};

export function PositionsTable({
  positions,
  onClose,
}: {
  positions: Position[];
  onClose: (id: string) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Asset</TableHead>
          <TableHead>Order Type</TableHead>
          <TableHead>P/L</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {positions.map((pos) => (
          <TableRow key={pos.id}>
            <TableCell className="font-medium">{pos.symbol}</TableCell>

            {/* Order Type */}
            <TableCell>
              <span
                className={`px-2 py-1 rounded-md text-sm font-medium ${
                  pos.side === "buy"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {pos.side.toUpperCase()} {pos.size}
              </span>
            </TableCell>

            {/* PnL */}
            <TableCell
              className={`font-semibold ${
                pos.pnl >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {pos.pnl.toFixed(2)}
            </TableCell>

            {/* Action */}
            <TableCell className="text-right">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onClose(pos.id)}
              >
                Close
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
