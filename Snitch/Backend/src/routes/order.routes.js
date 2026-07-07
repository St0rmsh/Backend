import express from "express";
import { checkout, completePayment, getUserOrders, getOrderById, updateOrderStatus } from "../controllers/order.controller.js";
import { authMiddleware, authSeller } from "../Middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/create", checkout);
router.post("/complete-payment", completePayment);
router.get("/my-orders", getUserOrders);
router.get("/:id", getOrderById);

// Seller routes
router.put("/:id/status", authSeller, updateOrderStatus);

export default router;
