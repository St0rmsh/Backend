import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";


const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Health Check
app.get("/health", (req, res) => {
    res.json({ message: "Server is live" });
});


// @Auth Routes 
// @access public

app.use("/api/auth", authRouter)




export default app
