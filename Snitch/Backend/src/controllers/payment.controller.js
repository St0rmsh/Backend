export const paymentWebhook = async (req, res) => {
    const signature = req.headers["x-razorpay-signature"]; 
    const isValid = verifyWebhookSignature(req.rawBody, signature, WEBHOOK_SECRET);
    if (!isValid) return res.status(400).json({ message: "Invalid signature" });

    const { orderId, paymentId, status } = extractPaymentEvent(req.body);
    if (status !== "captured") return res.status(200).json({ received: true });

    await orderService.completePayment(orderId, paymentId);
    res.status(200).json({ received: true });
};