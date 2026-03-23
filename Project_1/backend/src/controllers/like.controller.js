import likeModel from "../models/like.model.js";
import videoModel from "../models/video.model.js";

export const toggleReaction = async (req, res) => {
    try {
        const userId = req.user._id;
        const { videoId } = req.params;
        const { type } = req.body; // LIKE or DISLIKE

        if (!["LIKE", "DISLIKE"].includes(type)) {
            return res.status(400).json({ message: "Invalid type" });
        }

        const video = await videoModel.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        const existing = await likeModel.findOne({
            user: userId,
            video: videoId
        });

        // ❌ If same reaction → remove it (toggle off)
        if (existing && existing.type === type) {
            await likeModel.deleteOne({ _id: existing._id });

            if (type === "LIKE") {
                await videoModel.findByIdAndUpdate(videoId, {
                    $inc: { likesCount: -1 }
                });
            } else {
                await videoModel.findByIdAndUpdate(videoId, {
                    $inc: { dislikesCount: -1 }
                });
            }

            return res.json({ success: true, message: "Reaction removed" });
        }

        // 🔄 If opposite reaction exists → switch
        if (existing && existing.type !== type) {
            existing.type = type;
            await existing.save();

            if (type === "LIKE") {
                await videoModel.findByIdAndUpdate(videoId, {
                    $inc: { likesCount: 1, dislikesCount: -1 }
                });
            } else {
                await videoModel.findByIdAndUpdate(videoId, {
                    $inc: { dislikesCount: 1, likesCount: -1 }
                });
            }

            return res.json({ success: true, message: "Reaction switched" });
        }

        // ✅ No reaction → create new
        await likeModel.create({
            user: userId,
            video: videoId,
            type
        });

        if (type === "LIKE") {
            await videoModel.findByIdAndUpdate(videoId, {
                $inc: { likesCount: 1 }
            });
        } else {
            await videoModel.findByIdAndUpdate(videoId, {
                $inc: { dislikesCount: 1 }
            });
        }

        return res.json({ success: true, message: "Reaction added" });

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



