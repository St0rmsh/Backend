import express from "express";
import { getWishlist, toggleWishlist } from "../controllers/wishlist.controller.js";
import { authMiddleware } from "../Middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getWishlist);
router.post("/toggle", toggleWishlist);

export default router;
