// watchHistory.model.js
import mongoose from "mongoose";

const watchHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    },
    progress: {
        type: Number,
        default: 0
    }, // last point reached in seconds
    retention: {
        type: [Number],
        default: new Array(20).fill(0) // 20 buckets of 5% each
    },
    sessionStart: {
        type: Date,
        default: Date.now
    },
    viewCounted: {
        type: Boolean,
        default: false
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const WatchHistory = mongoose.model("WatchHistory", watchHistorySchema);

export default WatchHistory;
