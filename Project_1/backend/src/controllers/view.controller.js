import viewModel from "../models/view.model.js";
import videoModel from "../models/video.model.js";
import { getIO } from "../socket/connect.socket.js";

export const addView = async (req, res) => {
  try {
    const userId = req.user?._id || null;
    const videoId = req.params.videoId;
    const ip = req.ip;

    const cooldown = 60 * 1000;

    const lastView = await viewModel.findOne({
      video: videoId,
      $or: [{ user: userId }, { ip }]
    }).sort({ createdAt: -1 });

    if (lastView && (Date.now() - lastView.createdAt) < cooldown) {
      return res.json({ success: true, message: "Cooldown active" });
    }

    await viewModel.create({
      user: userId,
      video: videoId,
      ip
    });

    const updatedVideo = await videoModel.findByIdAndUpdate(
      videoId,
      { $inc: { views: 1 } },
      { new: true }
    );

    return res.json({
      success: true,
      views: updatedVideo.views
    });

  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


