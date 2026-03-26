import likeModel from "../models/like.model.js";
import videoModel from "../models/video.model.js";
import { getIO } from "../socket/connect.socket.js";


export const toggleReaction = async (req, res) => {
    try {
        const userId = req.user._id;
        const { videoId } = req.params;
        const { type } = req.body;

        // ✅ validate
        if (!["LIKE", "DISLIKE"].includes(type)) {
            return res.status(400).json({ message: "Invalid type" });
        }

        // ✅ check video
        const video = await videoModel.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        const existing = await likeModel.findOne({
            user: userId,
            video: videoId
        });

        let update = {};            // ✅ clean increment object
        let message = "";
        let userReaction = null;    // ✅ correct state tracking

        // ❌ REMOVE (same click again)
      if (existing && existing.type === type) {
    await likeModel.deleteOne({ _id: existing._id });

    if (type === "LIKE" && video.likesCount > 0) {
        update.likesCount = -1;
    }

    if (type === "DISLIKE" && video.dislikesCount > 0) {
        update.dislikesCount = -1;
    }

    userReaction = null;
    message = "Reaction removed";
}

        // 🔄 SWITCH (like → dislike OR dislike → like)
        else if (existing && existing.type !== type) {
            existing.type = type;
            await existing.save();

            if (type === "LIKE") {
                update = { likesCount: 1, dislikesCount: -1 };
            } else {
                update = { likesCount: -1, dislikesCount: 1 };
            }

            userReaction = type;
            message = "Reaction switched";
        }

        // ✅ NEW reaction
        else {
            await likeModel.create({
                user: userId,
                video: videoId,
                type
            });

            if (type === "LIKE") update.likesCount = 1;
            else update.dislikesCount = 1;

            userReaction = type;
            message = "Reaction added";
        }

        // ✅ update counts atomically
        const updatedVideo = await videoModel.findByIdAndUpdate(
            videoId,
            { $inc: update },
            { new: true }
        );

        // 🔌 socket emit (real-time)
        const io = getIO();
        io.to(videoId).emit("reaction:update", {
            videoId,
            likes: updatedVideo.likesCount,
            dislikes: updatedVideo.dislikesCount
        });

        // ✅ response
        return res.json({
            success: true,
            message,
            likes: updatedVideo.likesCount,
            dislikes: updatedVideo.dislikesCount,
            userReaction
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



export const getLikesCount = async (req, res) => {
    try {
        const { videoId } = req.params;

        const likes = await likeModel.countDocuments({
            video: videoId,
            type: "LIKE"
        });

        const dislikes = await likeModel.countDocuments({
            video: videoId,
            type: "DISLIKE"
        });

        return res.json({
            success: true,
            likes,
            dislikes
        });

    } catch {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUserReaction = async (req, res) => {
    try {
        const userId = req.user._id;
        const { videoId } = req.params;

        const reaction = await likeModel.findOne({
            user: userId,
            video: videoId
        });

        return res.json({
            success: true,
            reaction: reaction?.type || null
        });

    } catch {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getVideoLikes = async (req, res) => {
    try {
        const { videoId } = req.params;

        const likes = await likeModel
            .find({ video: videoId, type: "LIKE" })
            .populate("user", "username avatar");

        const dislikes = await likeModel
            .find({ video: videoId, type: "DISLIKE" })
            .populate("user", "username avatar");

        return res.json({
            success: true,
            likes,
            dislikes
        });

    } catch {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUserLikes = async (req, res) => {
    try {
        const userId = req.user._id;

        const likes = await likeModel
            .find({ user: userId, type: "LIKE" })
            .populate("video", "title thumbnail duration");

        const dislikes = await likeModel
            .find({ user: userId, type: "DISLIKE" })
            .populate("video", "title thumbnail duration");

        return res.json({
            success: true,
            likes,
            dislikes
        });

    } catch {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



