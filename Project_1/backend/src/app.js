import express from "express"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import cors from "cors"
import multer from "multer"
import fs from "fs"
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

// analytics
import analyticsRoutes from "./routes/analytics.routes.js"
app.use("/api/analytics", analyticsRoutes)








setInterval(async () => {
  try {
    const files = await fs.promises.readdir(".");

    for (const file of files) {
      if (file.startsWith("frames-")) {
        await fs.promises.rm(file, {
          recursive: true,
          force: true
        });
        console.log("🧹 Deleted leftover:", file);
      }
    }
  } catch (err) {
    console.log("Cleanup cron error:", err.message);
  }
}, 60 * 60 * 1000); 




app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError || err.message.includes("Invalid file")) {
        return res.status(400).json({ message: err.message });
    }
    next(err);
});


app.use((err, req, res, next) => {
  if (err.message.includes("Only")) {
    return res.status(400).json({ message: err.message });
  }

  console.error(err);
  res.status(500).json({ message: "Server Error" });
});

export default app