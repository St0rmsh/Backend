import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: function() {
            // Rating is required only for root reviews (no parentId)
            return !this.parentId;
        }
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
        default: null
    },
    role: {
        type: String,
        enum: ["buyer", "seller"],
        required: true
    },
    verifiedPurchase: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
