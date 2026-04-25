import express from "express";
import { getCart, addToCart, updateCartItem, removeFromCart } from "../controllers/cart.controller.js";
import { authMiddleware } from "../Middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/remove", removeFromCart);

export default router;
