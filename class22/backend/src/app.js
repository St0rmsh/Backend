const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials:true,
    origin:"http://localhost:5173"
}))



const authRoutes = require("./router/auth.route")
const postRoutes = require("./router/post.routes")
const userRoutes = require("./router/user.route")

app.use("/api/auth", authRoutes)
app.use("/api/post",postRoutes)
app.use("/api/user",userRoutes)



module.exports = app