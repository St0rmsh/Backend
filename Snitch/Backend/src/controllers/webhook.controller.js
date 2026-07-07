import orderService from "../services/order.service.js";
import { verifyWebhookSignature } from "../services/razorpay.service.js";

export const paymentWebhook = async (req, res) => {
    try {
        const signature = req.headers["x-razorpay-signature"];
        const isValid = verifyWebhookSignature(req.rawBody, signature);
        if (!isValid) {
            console.error("Invalid Razorpay webhook signature");
            return res.status(400).json({ message: "Invalid signature" });
        }

        const event = req.body; // already parsed JSON, see raw-body setup below

        if (event.event === "payment.captured") {
            const payment = event.payload.payment.entity;
            await orderService.completePaymentFromWebhook(payment.order_id, payment.id);
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error("Webhook processing error:", error);
        res.status(200).json({ received: true, note: error.message }); 
    }
};