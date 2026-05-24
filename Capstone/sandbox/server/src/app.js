import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import sandboxRoutes from "./routes/sandbox.routes.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser())

app.get("/api/sandbox/health", async (req,res) =>{
   res.status(200).json({
    status: "ok",
    message: "Sandbox is healthy",
    timestamp: new Date().toISOString()
   });
});

app.use("/api/sandbox", sandboxRoutes);




export default app