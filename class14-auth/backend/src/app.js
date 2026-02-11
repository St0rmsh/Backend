const express = require("express")
const cookieParser = require("cookie-parser")
const userAuthRoutes = require("./routes/user.routes")

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", userAuthRoutes)

module.exports = app