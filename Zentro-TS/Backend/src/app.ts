import express from "express"
import authRouter from "./routes/auth.routes.js"
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app = express()


app.use(express.json())

app.use(cookieParser())

app.use(morgan("dev"))

app.get("/",(req,res)=>{
    return res.status(200).json({
        message:'Health Check route'
    })
})


app.use("/api/auth",authRouter)


export default app