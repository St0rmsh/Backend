import restockDao from "../daos/restock.dao.js";

class RestockService {
    async joinWaitlist(userId, productId, variantId) {
        return await restockDao.create(userId, productId, variantId);
    }

    // Called whenever a seller updates stock upward — checks for waiters and
    // "notifies" them. Actual email sending is a TODO: wire in your existing
    // Nodemailer transporter here (reused from Zentro) once available;
    // for now this logs so the mechanism is verifiable end-to-end.
    async notifyWaitlist(productId, variantId) {
        const waiters = await restockDao.findPendingFor(productId, variantId);
        if (waiters.length === 0) return;

        for (const w of waiters) {
            console.log(`[Restock Notify] Would email ${w.user.email} — item back in stock`);
            // TODO: await sendRestockEmail(w.user.email, productId, variantId);
        }

        await restockDao.markNotified(waiters.map(w => w._id));
    }
}

export default new RestockService();