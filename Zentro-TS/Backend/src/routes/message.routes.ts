import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getConversationController, markConversationReadController, sendMessageController } from "../controller/message.controller.js";

const router = Router();
router.use(authMiddleware);
router.get("/:userId", getConversationController);
router.post("/:userId", sendMessageController);
router.patch("/:userId/read", markConversationReadController);

export default router;
