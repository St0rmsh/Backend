import mongoose from "mongoose";

const restockRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    variant: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    notified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

restockRequestSchema.index({ product: 1, variant: 1, notified: 1 });
restockRequestSchema.index({ user: 1, product: 1, variant: 1 }, { unique: true });

const RestockRequest = mongoose.model("RestockRequest", restockRequestSchema);
export default RestockRequest;