import express from "express"
import authRouter from "./routes/auth.routes.js"
import morgan from "morgan";
import cookieParser from "cookie-parser";
import followersRouter from "./routes/Followers.routes.js";
import userProfileRouter from "./routes/userProfile.route.js";
import PostRouter from "./routes/Posts.route.js";
import likeRouter from "./routes/like.route.js";
import CommentRouter from "./routes/comment.route.js";

const app = express()


app.use(express.json())

app.use(cookieParser())

app.use(morgan("dev"))

app.get("/",(req,res)=>{
    return res.status(200).json({
        message:'Health Check route'
    })
})


// Auth routes
app.use("/api/auth",authRouter)



// Followers routes
app.use("/api/follow",followersRouter)


// User profile routes
app.use("/api/profile",userProfileRouter)


// Post routes
app.use("/api/post", PostRouter)


// Like routes
app.use("/api/like", likeRouter)


app.use("/api/comment", CommentRouter)

export default app