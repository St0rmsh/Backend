import watchModel from "../models/watch.model.js";
import videoModel from "../models/video.model.js";

export const updateWatchTime = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { watchTime } = req.body;

        if (!watchTime) {
            return res.status(400).json({ message: "watchTime required" });
        }

        // simple increment only
        await videoModel.findByIdAndUpdate(videoId, {
            $inc: { totalWatchTime: watchTime }
        });

        return res.json({
            success: true,
            message: "Watch time updated"
        });

    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
