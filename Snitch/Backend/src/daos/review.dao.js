import Review from "../models/review.model.js";

class ReviewDAO {
    async create(reviewData) {
        const review = new Review(reviewData);
        return await review.save();
    }

    async findByProductId(productId, options = {}) {
        const { sort = { createdAt: -1 }, limit = 10, skip = 0 } = options;
        return await Review.find({ productId, parentId: null })
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .populate("userId", "fullname");
    }

    async findReplies(reviewId) {
        return await Review.find({ parentId: reviewId }).populate("userId", "fullname");
    }

    async findBySellerId(sellerId, productIds, options = {}) {
        const { sort = { createdAt: -1 }, limit = 10, skip = 0 } = options;
        return await Review.find({ productId: { $in: productIds }, parentId: null })
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .populate("userId", "fullname")
            .populate("productId", "title");
    }

    async countByProductId(productId) {
        return await Review.countDocuments({ productId, parentId: null });
    }

    async updateById(id, updateData) {
        return await Review.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }

    async findById(id) {
        return await Review.findById(id);
    }

    async deleteById(id) {
        return await Review.findByIdAndDelete(id);
    }

    async deleteRepliesByParentId(parentId) {
        return await Review.deleteMany({ parentId });
    }

    async countVerifiedByProductId(productId) {
        return await Review.countDocuments({ productId, parentId: null, verifiedPurchase: true });
    }
}

export default new ReviewDAO();
