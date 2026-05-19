import express from "express";
import morgan from "morgan";


const app = express();

app.use(morgan("dev"));

app.get("/sandbox/health", (req, res) => {
  res.status(200).json({ message: "Health check passed!" });
});


export default app;