import { Router } from "express";
import {
    addComment,
    getComments,
    deleteComment,
    reactToComment
} from "../controllers/comment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// /api/comment/add
// POST
router.post("/:videoId/comment", authMiddleware, addComment);


// /api/comment/:videoId
// GET
router.get("/:videoId", getComments);


// /api/comment/:commentId
// DELETE
router.delete("/:commentId", authMiddleware, deleteComment);

router.post("/:commentId/react", authMiddleware, reactToComment);

export default router;
