import Redis from "ioredis";

const redis = new Redis(6370);
const symbol = "btcusdt";
const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@trade`);

ws.onmessage = (event) => {
  try {
    const trade = JSON.parse(event.data.toString());

    if (!trade.s || !trade.p) {
      console.log("Ignored message:", trade);
      return;
    }

    // "e": "aggTrade",    // Event type
    // "E": 1672515782136, // Event time
    // "s": "BNBBTC",      // Symbol
    // "a": 12345,         // Aggregate trade ID
    // "p": "0.001",       // Price
    // "q": "100",         // Quantity
    // "f": 100,           // First trade ID
    // "l": 105,           // Last trade ID
    // "T": 1672515782136, // Trade time
    // "m": true,          // Is the buyer the market maker?
    // "M": true           // Ignore

    const payload = {
      symbol: trade.s,
      price: trade.p,
      qty: trade.q,
      time: trade.T,
    };

    const wsPayload = {
      symbol: trade.s,
      bid: trade.p,
      ask: Number(
        Number(trade.p) + Number((trade.p * 0.01).toFixed(2))
      ).toFixed(2),
      qty: trade.q,
      time: trade.T,
    };

    redis.publish("trades", JSON.stringify(wsPayload));
    redis.rpush("trades_queue", JSON.stringify(payload));
    redis.set(`${trade.s}:latestPrice`, Number(trade.p));
  } catch (err) {
    console.error("Failed to parse trade:", err);
  }
};

ws.onopen = () => console.log("WebSocket connected");
ws.onclose = () => console.log("WebSocket closed");
ws.onerror = (err) => console.error("WebSocket error", err);
