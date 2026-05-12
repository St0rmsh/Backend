import express from "express";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get("/api/sandbox/health", async (req,res) =>{
   res.status(200).json({
    status: "ok",
    message: "Sandbox is healthy",
    timestamp: new Date().toISOString()
   });
});


export default app