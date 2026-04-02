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
    }, // seconds
}, { timestamps: true });

const WatchHistory = mongoose.model("WatchHistory", watchHistorySchema);

export default WatchHistory;
