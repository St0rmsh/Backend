import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
        required: true
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// prevent duplicate subscription
subscriberSchema.index({ user: 1, channel: 1 }, { unique: true });

const subscriberModel = mongoose.model("Subscriber", subscriberSchema);
export default subscriberModel;
