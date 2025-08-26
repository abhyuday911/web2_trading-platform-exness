import express from "express";

const app = express();
app.use(express.json())

app.get("/index", (req,res) => {})



app.listen(3000, () => console.log("app running at 3000"));
