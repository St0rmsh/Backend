import express from "express"
import authRouter from "./routes/auth.routes.js"
import morgan from "morgan";
import cookieParser from "cookie-parser";
import followersRouter from "./routes/Followers.routes.js";
import userProfileRouter from "./routes/userProfile.route.js";
import PostRouter from "./routes/Posts.route.js";
import likeRouter from "./routes/like.route.js";
import CommentRouter from "./routes/comment.route.js";
import bookmarkRouter from "./routes/bookmark.route.js";
import feedRouter from "./routes/feed.route.js";
import notificationRouter from "./routes/notification.routes.js";
import cors from "cors"
const app = express()


app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
}))

app.use(express.json())

app.use(cookieParser())

app.use(morgan("dev"))

app.get("/", (req, res) => {
    return res.status(200).json({
        message: 'Health Check route'
    })
})


// Auth routes
app.use("/api/auth", authRouter)



// Followers routes
app.use("/api/follow", followersRouter)


// User profile routes
app.use("/api/profile", userProfileRouter)


// Post routes
app.use("/api/post", PostRouter)


// Feed routes
app.use("/api/feed", feedRouter)


// Like routes
app.use("/api/like", likeRouter)


// Comment route
app.use("/api/comment", CommentRouter)


// Bookmark route
app.use("/api/bookmark", bookmarkRouter)

// Notification route
app.use("/api/notification", notificationRouter)

export default app