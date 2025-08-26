import Redis from "ioredis";

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
});
const symbol = "btcusdt";
const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@trade`);

ws.onmessage = (event) => {
  try {
    const trade = JSON.parse(event.data.toString());

    if (!trade.s || !trade.p) {
      console.log("⚠️ Ignored message:", trade);
      return;
    }

    const payload = {
      symbol: trade.s,
      price: trade.p,
      time: trade.T,
    };

    redis.publish("trades", JSON.stringify(payload));
  } catch (err) {
    console.error("❌ Failed to parse trade:", err);
  }
};

ws.onopen = () => console.log("WebSocket connected");
ws.onclose = () => console.log("WebSocket closed");
ws.onerror = (err) => console.error("WebSocket error", err);
