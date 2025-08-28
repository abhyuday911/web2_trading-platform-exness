import express from "express";
import { connectDB } from "../db/client";

const app = express();
app.use(express.json());
const client = await connectDB();
const PORT = process.env.PORT || 3000;

app.get("/index", (req, res) => console.log("first"));



app.listen(PORT, () => console.log("app running at 3000"));
