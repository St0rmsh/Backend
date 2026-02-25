const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))



const authRoutes = require("./routes/auth.routes")
app.use("/api/auth",authRoutes)


const postRoutes = require("./routes/post.routes")
app.use("/api/post",postRoutes)



const userRoutes = require("./routes/user.routes")
app.use("/api/user",userRoutes)


module.exports = app