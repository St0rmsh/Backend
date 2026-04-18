import WatchHistory from "../models/watchHistory.model.js";
import videoModel from "../models/video.model.js";

// every 5 sec
export const updateWatchTime = async (req, res) => {
  const { videoId, time, duration } = req.body;
  const userId = req.user._id;

  if (!videoId || time < 0) {
    return res.status(400).json({ message: "Invalid data" });
  }

  // 📈 Retention Tracking (Percentage based - 20 buckets of 5% each)
  const bucketIndex = Math.min(19, Math.floor((time / (duration || 1)) * 20));

  const existing = await WatchHistory.findOne({ user: userId, video: videoId });

  if (existing) {
    existing.progress = time;
    existing.lastUpdated = new Date();
    
    // Increment retention bucket if not already maxed out for this session
    if (bucketIndex >= 0) {
      existing.retention[bucketIndex] = (existing.retention[bucketIndex] || 0) + 1;
      existing.markModified("retention");
    }
    
    await existing.save();
  } else {
    const newRetention = new Array(20).fill(0);
    if (bucketIndex >= 0) newRetention[bucketIndex] = 1;

    await WatchHistory.create({
      user: userId,
      video: videoId,
      progress: time,
      retention: newRetention
    });
  }

  // 🧠 SMART VIEW: If watched > 5s and never counted, increment video views
  if (time > 5) {
     const record = existing || await WatchHistory.findOne({ user: userId, video: videoId });
     if (record && !record.viewCounted) {
        await videoModel.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
        record.viewCounted = true;
        await record.save();
     }
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

