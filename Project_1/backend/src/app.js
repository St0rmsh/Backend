import express from "express"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import cors from "cors"
import multer from "multer"
const app = express()



app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))



// auth
// Routes
import authRoutes from "./routes/auth.routes.js"
app.use("/api/auth",authRoutes)



// channel
// Routes
import channelRoutes from "./routes/channel.route.js"
app.use("/api/channel",channelRoutes)


// video
// Routes
import videoRoutes from "./routes/video.routes.js"
app.use("/api/video",videoRoutes)


// comment
// Routes
import commentRoutes from "./routes/comment.routes.js"
app.use("/api/comment",commentRoutes)


// like
// Routes
import likeRoutes from "./routes/like.routes.js"
app.use("/api/like",likeRoutes)


// subscription
// Routes
import subscriptionRoutes from "./routes/subscriber.routes.js"
app.use("/api/subscription",subscriptionRoutes)













app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError || err.message.includes("Invalid file")) {
        return res.status(400).json({ message: err.message });
    }
    next(err);
});

export default app