import Razorpay from "razorpay";
import crypto from "crypto";

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async ({ amount, currency = "INR", receipt }) => {
    const options = {
        amount: Math.round(amount * 100), // Razorpay wants the smallest currency unit (paise)
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
    };
    return await razorpayInstance.orders.create(options);
};

// Used on the frontend-confirm path (handler callback from Razorpay checkout.js)
export const verifyPaymentSignature = ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) return false;
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");
    return expectedSignature === razorpaySignature;
};

// Used on the webhook path — signs the raw request body, not orderId|paymentId
export const verifyWebhookSignature = (rawBody, signature) => {
    if (!rawBody || !signature) return false;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest("hex");
    return expectedSignature === signature;
};

export default razorpayInstance;