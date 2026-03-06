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



// Routes 

const AuthRoutes = require("../src/router/auth.routes")
const songRoutes = require("../src/router/song.routes")



app.use("/api/auth",AuthRoutes)
app.use("/api/song",songRoutes)





module.exports = app