import express from "express"
import AuthRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"

const app = express()
app.use(express.json())
app.use(cookieParser())


app.use("/api/auth",AuthRouter)


app.get("/", (req,res)=>{
    res.json({
        message:"Server is running"
    })
    
})










export default app