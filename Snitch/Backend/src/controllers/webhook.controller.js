import orderService from "../services/order.service.js";
import { verifyWebhookSignature } from "../services/razorpay.service.js";

export const paymentWebhook = async (req, res) => {
    try {
        const signature = req.headers["x-razorpay-signature"];
        const isValid = verifyWebhookSignature(req.rawBody, signature);
        if (!isValid) {
            console.warn("Webhook signature verification failed");
            return res.status(400).json({ message: "Invalid signature" });
        }

        const event = req.body;

        if (event.event === "payment.captured") {
            const payment = event.payload.payment.entity;
            await orderService.completePaymentFromWebhook({
                razorpayOrderId: payment.order_id,
                razorpayPaymentId: payment.id,
                razorpaySignature: signature,
            });
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error("Webhook processing error:", error);
        if (error.message?.includes("not found")) {
            return res.status(200).json({ received: true, note: error.message });
        }
        res.status(500).json({ message: "Webhook processing failed" });
    }
};