import express from "express"
import AuthRouter from "./routes/auth.routes.js"
import chatRouter from "./routes/chat.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import morgan from "morgan"

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    methods:["Get","Post","Put","Delete"]
}))

app.use("/api/auth",AuthRouter)
app.use("/api/chats", chatRouter)


app.get("/", (req,res)=>{
    res.json({
        message:"Server is running"
    })
    
})

app.get("/api/auth/login", (req,res)=>{
    res.send(`<h1>Login Page</h1>`)
})










export default app