import watchModel from "../models/watch.model.js";
import videoModel from "../models/video.model.js";

export const updateWatchTime = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { videoId } = req.params;
    const { watchTime } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!watchTime && watchTime !== 0) {
      return res.status(400).json({ message: "watchTime required" });
    }

    // Optional: validate number
    if (typeof watchTime !== "number") {
      return res.status(400).json({ message: "Invalid watchTime" });
    }

    // ✅ save logic (example)
    await watchModel.findOneAndUpdate(
      { user: userId, video: videoId },
      { watchTime },
      { upsert: true }
    );

    return res.json({ success: true });

  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

