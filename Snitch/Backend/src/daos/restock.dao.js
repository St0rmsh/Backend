import RestockRequest from "../models/restock.model.js";

class RestockDAO {
    async create(userId, productId, variantId) {
        return await RestockRequest.findOneAndUpdate(
            { user: userId, product: productId, variant: variantId || null },
            { user: userId, product: productId, variant: variantId || null, notified: false },
            { upsert: true, new: true }
        );
    }

    async findPendingFor(productId, variantId) {
        return await RestockRequest.find({ product: productId, variant: variantId || null, notified: false })
            .populate("user", "email fullname");
    }

    async markNotified(ids) {
        return await RestockRequest.updateMany({ _id: { $in: ids } }, { $set: { notified: true } });
    }
}

export default new RestockDAO();