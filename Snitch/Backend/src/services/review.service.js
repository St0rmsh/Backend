import reviewDao from "../daos/review.dao.js";
import orderDao from "../daos/order.dao.js";
import productDao from "../daos/product.dao.js";

class ReviewService {
    async addReview(userId, productId, reviewData) {
        const isVerified = await orderDao.checkVerifiedPurchase(userId, productId);
        
        const review = await reviewDao.create({
            ...reviewData,
            userId,
            productId,
            verifiedPurchase: isVerified,
            role: "buyer"
        });

        const allReviews = await reviewDao.findByProductId(productId, { limit: 10000 });
        const rootReviews = allReviews.filter(r => !r.parentId);
        const totalRating = rootReviews.reduce((sum, r) => sum + (r.rating || 0), 0);
        const averageRating = rootReviews.length > 0 ? totalRating / rootReviews.length : 0;
        const numReviews = rootReviews.length;

        return await productDao.updateById(productId, {
            averageRating,
            numReviews,
            $push: { reviews: review._id }
        });
    }

  async getReviewsByProduct(productId, options = {}) {
        const reviews = await reviewDao.findByProductId(productId, options);
        const total = await reviewDao.countByProductId(productId);
        const verifiedCount = await reviewDao.countVerifiedByProductId(productId);
        
        const reviewsWithReplies = await Promise.all(reviews.map(async (review) => {
            const replies = await reviewDao.findReplies(review._id);
            return { ...review.toObject(), replies };
        }));
        
        return { reviews: reviewsWithReplies, total, verifiedCount };
    }

    async replyToReview(userId, reviewId, comment, sellerId) {
        const review = await reviewDao.findById(reviewId);
        if (!review) throw new Error("Review not found");

        const product = await productDao.findById(review.productId);
        if (product.seller._id.toString() !== sellerId.toString()) {
            throw new Error("Unauthorized: Only the product seller can reply");
        }

        const existingReply = await reviewDao.findReplies(reviewId);
        const sellerReply = existingReply.find(r => r.role === "seller");

        if (sellerReply) {
            await reviewDao.updateById(sellerReply._id, { comment });
        } else {
            await reviewDao.create({
                userId,
                productId: review.productId,
                parentId: reviewId,
                comment,
                role: "seller"
            });
        }
        return await productDao.findById(review.productId);
    }

    async getSellerReviews(sellerId, options = {}) {
        const products = await productDao.find({ seller: sellerId }, { limit: 1000 });
        const productIds = products.map(p => p._id);
        const reviews = await reviewDao.findBySellerId(sellerId, productIds, options);
        
        const reviewsWithReplies = await Promise.all(reviews.map(async (review) => {
            const replies = await reviewDao.findReplies(review._id);
            return { ...review.toObject(), replies };
        }));
        return { reviews: reviewsWithReplies, products };
    }

    async updateReview(userId, reviewId, updateData) {
        const review = await reviewDao.findById(reviewId);
        if (!review) throw new Error("Review not found");
        if (review.userId.toString() !== userId.toString()) throw new Error("Unauthorized");

        await reviewDao.updateById(reviewId, updateData);

        // Recalculate ratings
        const allReviews = await reviewDao.findByProductId(review.productId, { limit: 10000 });
        const rootReviews = allReviews.filter(r => !r.parentId);
        const totalRating = rootReviews.reduce((sum, r) => sum + (r.rating || 0), 0);
        const averageRating = rootReviews.length > 0 ? totalRating / rootReviews.length : 0;

        return await productDao.updateById(review.productId, {
            averageRating,
            numReviews: rootReviews.length
        });
    }

    async deleteReview(userId, reviewId) {
        const review = await reviewDao.findById(reviewId);
        if (!review) throw new Error("Review not found");
        if (review.userId.toString() !== userId.toString()) throw new Error("Unauthorized");

        const productId = review.productId;
        
        // Delete the review and its replies
        await reviewDao.deleteById(reviewId);
        await reviewDao.deleteRepliesByParentId(reviewId);

        // Update product reviews array
        await productDao.updateById(productId, {
            $pull: { reviews: reviewId }
        });

        // Recalculate ratings
        const allReviews = await reviewDao.findByProductId(productId, { limit: 10000 });
        const rootReviews = allReviews.filter(r => !r.parentId);
        const totalRating = rootReviews.reduce((sum, r) => sum + (r.rating || 0), 0);
        const averageRating = rootReviews.length > 0 ? totalRating / rootReviews.length : 0;

        return await productDao.updateById(productId, {
            averageRating,
            numReviews: rootReviews.length
        });
    }
}

export default new ReviewService();
