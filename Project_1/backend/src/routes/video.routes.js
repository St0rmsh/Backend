import { Router } from "express";
import upload from "../middleware/upload.middleware.js";
import { videoUpload,getAllVideos,getVideo,getMyVideos,deleteVideo } from "../controllers/video.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { addView } from "../controllers/view.controller.js";
import { updateWatchTime } from "../controllers/watch.controller.js";

const router = Router()

// /api/video/me
// GET
router.get("/me", authMiddleware, getMyVideos); 

// /api/video/upload
// POST
router.post("/upload",authMiddleware,upload.single("video"),videoUpload);

// /api/video
// GET
router.get("/", getAllVideos);

// /api/video/:id
// DELETE
router.delete("/:id", authMiddleware, deleteVideo);

// /api/video/:id
// GET
router.get("/:id",getVideo);




// /api/video/:videoId/view
// POST
router.post("/:videoId/view",authMiddleware,addView);


// /api/video/:videoId/watch
// POST
router.post("/:videoId/watch",authMiddleware,updateWatchTime);

export default router