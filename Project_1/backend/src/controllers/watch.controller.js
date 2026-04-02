import WatchHistory from "../models/watchHistory.model.js";


// every 5 sec
export const updateWatchTime = async (req, res) => {
  const { videoId, time } = req.body;
  const userId = req.user.id;

  if (!videoId || time < 1) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const existing = await WatchHistory.findOne({ user: userId, video: videoId });

  if (existing) {
    existing.progress = time;
    await existing.save();
  } else {
    await WatchHistory.create({
      user: userId,
      video: videoId,
      progress: time
    });
  }

  res.json({ success: true });
};

export const getWatchTime = async (req, res) => {
  const { videoId } = req.params;

  const record = await WatchHistory.findOne({
    user: req.user.id,
    video: videoId
  });

  res.json({ time: record?.progress || 0 });
};

