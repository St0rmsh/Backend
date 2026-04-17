import express, { type   Application } from "express"
import {type Request, type Response} from "express"
import cookieParser from "cookie-parser"
const app: Application = express()
app.use(express.json())
app.use(cookieParser())


 type HealthResponse = {
   status: "ok" | "fail"
}

app.get("/", (req: Request<{},HealthResponse, {}>, res: Response<HealthResponse>) => {
    res.json({status: "ok"})
})


import authRoutes from "./routes/auth.routes.js"
app.use("/api/auth", authRoutes)

export default app