import { Router } from "express";
import {
    addComment,
    getComments,
    deleteComment
} from "../controllers/comment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// /api/comment/add
// POST
router.post("/add", authMiddleware, addComment);


// /api/comment/:videoId
// GET
router.get("/:videoId", getComments);


// /api/comment/:commentId
// DELETE
router.delete("/:commentId", authMiddleware, deleteComment);

export default router;
