import { Router } from "express";
import {
    createChannel,
    getMyChannel,
    getChannelByHandle,
    updateChannel,
    getChannelVideos

} from "../controllers/channel.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();


// /api/channel/create
// POST
router.post("/create", authMiddleware, createChannel);


// /api/channel/me
// GET
router.get("/me", authMiddleware, getMyChannel);


// /api/channel/:handle/videos
// GET
router.get("/:handle/videos", getChannelVideos);


// /api/channel/:handle
// GET
router.get("/:handle", getChannelByHandle);


// /api/channel/update
// PUT
router.put("/update", authMiddleware, updateChannel);

export default router;
