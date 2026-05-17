
import express from "express";
import morgan from "morgan";
import agentRouter from "./routes/agent.routes.js"

const app = express();


app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get("/api/status/healthz", (req,res)=>{

    res.status(200).json({
        message:"All systems operational",
        status:200
    })
})

app.use("/api/ai/",agentRouter)

export default app;