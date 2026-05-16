import express from "express";
import morgan from "morgan";

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

app.post("/api/ai/invoke",(req,res)=>{
    
})

export default app;