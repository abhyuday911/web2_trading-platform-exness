import express from "express";
import {
  closeUserOrders,
  getCandles,
  getUser,
  getUserOrders,
  order,
  signIn,
  signUp,
} from "./controller/indexController";
const cors = require("cors");
import cookieParser from "cookie-parser";
import { isLoggedIn } from "./middleware/isLoggedIn";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3040;
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// == Chart routes == //
app.get("/candles", getCandles);

// == Users routes == //
app.get("/api/me", getUser);
app.post("/signup", signUp);
app.post("/signin", signIn);

// == Orders == //
app.post("/api/orders", isLoggedIn, order);
app.get("/api/orders", isLoggedIn, getUserOrders);
app.post("/api/orders/close", isLoggedIn, closeUserOrders);

// == Port == //
app.listen(PORT, () => console.log(`app running at ${PORT}`));
