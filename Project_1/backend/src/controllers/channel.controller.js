import channelModel from "../models/channel.model.js";
import userModel from "../models/user.model.js";
import videoModel from "../models/video.model.js";

/**
 * ✅ Create Channel
 */
export const createChannel = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        let { name, handle, description } = req.body;

        if (!name || !handle) {
            return res.status(400).json({ message: "Name and handle required" });
        }

        handle = handle.toLowerCase().trim();

        const handleRegex = /^[a-z0-9_]{3,30}$/;
        if (!handleRegex.test(handle)) {
            return res.status(400).json({
                message: "Handle must be 3-30 chars, lowercase, no spaces"
            });
        }

        const existingChannel = await channelModel.findOne({ owner: userId });
        if (existingChannel) {
            return res.status(400).json({ message: "User already has a channel" });
        }

        const handleExists = await channelModel.findOne({ handle });
        if (handleExists) {
            return res.status(409).json({ message: "Handle already taken" });
        }

        const channel = await channelModel.create({
            name,
            handle,
            description,
            owner: userId
        });

        await userModel.findByIdAndUpdate(userId, {
            $set: { channel: channel._id }
        });

        return res.status(201).json({ success: true, channel });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * ✅ Get My Channel
 */
export const getMyChannel = async (req, res) => {
    try {
        const userId = req.user?._id;

        const channel = await channelModel.findOne({ owner: userId });

        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        return res.status(200).json({ success: true, channel });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * ✅ Get Channel by Handle
 */
export const getChannelByHandle = async (req, res) => {
    try {
        const handle = req.params.handle.toLowerCase();

        const channel = await channelModel
            .findOne({ handle })
            .populate("owner", "username avatar");

        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        return res.status(200).json({ success: true, channel });

    } catch {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * ✅ Update Channel
 */
export const updateChannel = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const channel = await channelModel.findOne({ owner: userId });
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        const { name, description, avatar, banner } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (avatar) updateData.avatar = avatar;
        if (banner) updateData.banner = banner;

        const updated = await channelModel.findByIdAndUpdate(
            channel._id,
            { $set: updateData },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            channel: updated
        });

    } catch {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * ✅ Get Channel Videos
 */
export const getChannelVideos = async (req, res) => {
    try {
        const handle = req.params.handle.toLowerCase();

        const channel = await channelModel.findOne({ handle });

        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        const videos = await videoModel
            .find({ channel: channel._id })
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, videos });

    } catch {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
