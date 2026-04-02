import express from "express";
import useGraph from "./services/grahp.ai.service.js"

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World! Whaat?");
});

app.post("/use-graph" , async (req, res)=> {
  await useGraph("Write a factorial function in javascript")

})

export default app;