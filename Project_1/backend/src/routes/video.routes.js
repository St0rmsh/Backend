import { Router } from "express";
import upload from "../middleware/upload.middleware.js";
import { videoUpload,getAllVideos,getVideo } from "../controllers/video.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router()

// /api/video/upload
// POST
router.post("/upload",authMiddleware,upload.single("video"),videoUpload);
// /api/video
// GET
router.get("/", getAllVideos);

// /api/video/:id
// GET
router.get("/:id",getVideo);

export default router