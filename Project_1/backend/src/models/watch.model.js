import mongoose from "mongoose";

const watchSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true
    },

    watchTime: {
        type: Number,
        default: 0 // seconds watched
    },

    lastPosition: {
        type: Number,
        default: 0 // seconds
    },

    completed: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

// one user → one watch record per video
watchSchema.index({ user: 1, video: 1 }, { unique: true });

const watchModel = mongoose.model("Watch", watchSchema);

export default watchModel
