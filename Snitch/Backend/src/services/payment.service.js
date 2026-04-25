import Razorpay from "razorpay";
import { config } from "../config/config.js";

const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET,
});

export const createOrder = async ({ amount, currency  }) => {
  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency,
    receipt: `order_${Date.now()}`,
  });
  return order;
};