import crypto from "crypto";
import Razorpay from "razorpay";
import { config } from "../config/config.js";

const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET,
});

export const createOrder = async ({ amount, currency }) => {
  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100), // paise, must be integer
    currency,
    receipt: `order_${Date.now()}`,
  });
  return order;
};

// ADD THIS — was referenced but never defined
export const verifyWebhookSignature = (rawBody, signatureHeader) => {
  const expectedSignature = crypto
    .createHmac("sha256", config.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  return expectedSignature === signatureHeader;
};