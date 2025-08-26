import { WebSocketServer } from "ws";
import Redis from "ioredis";

const sub = new Redis({
    host:"127.0.0.1",
    port: 6379
});
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => console.log("web socket server connected"));

sub.subscribe("trades", () => {
  console.log("Subscribed to trades channel");
});

sub.on("message", (channel, message) => {
//   console.log("Redis message received:", message); // 👈 test send
  if (channel === "trades") {
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(message);
      }
    });
  }
});
