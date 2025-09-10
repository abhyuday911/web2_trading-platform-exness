import { WebSocketServer } from "ws";
import Redis from "ioredis";

const sub = new Redis(6370);
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => console.log("web socket server connected"));

sub.subscribe("trades", () => {
  console.log("Subscribed to trades channel");
});

sub.on("message", (channel, message) => {
  if (channel === "trades") {
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(message);
      }
    });
  }
});
