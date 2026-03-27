import commentModel from "../models/comment.model.js";
import videoModel from "../models/video.model.js";
import { getIO } from "../socket/connect.socket.js";

export const addComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { videoId } = req.params;
    const { text } = req.body;

    const comment = await commentModel.create({
      video: videoId,
      user: userId,
      text
    });

    await videoModel.findByIdAndUpdate(videoId, {
      $inc: { commentsCount: 1 }
    });

    // 🔥 REAL-TIME EMIT
    const io = getIO();
    io.to(videoId).emit("comment:new", {
      comment
    });

    return res.status(201).json({
      success: true,
      comment
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



// ➤ Get Comments for Video
export const getComments = async (req, res) => {
    try {
        const { videoId } = req.params;

        const comments = await commentModel
            .find({ video: videoId })
            .sort({ createdAt: -1 })
            .populate("user", "username avatar");

        // 🔥 add timeAgo
        const formatted = comments.map(c => ({
            _id: c._id,
            text: c.text,
            user: c.user,
            createdAt: c.createdAt,
            timeAgo: timeAgo(c.createdAt)
        }));

        return res.status(200).json({
            success: true,
            comments: formatted
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


// ➤ Delete Comment (only owner)
export const deleteComment = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { commentId } = req.params;

        const comment = await commentModel.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not allowed" });
        }

        await comment.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Comment deleted"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
