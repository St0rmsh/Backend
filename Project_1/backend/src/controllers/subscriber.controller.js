import subscriberModel from "../models/subscribe.model.js";
import channelModel from "../models/channel.model.js";
import userModel from "../models/user.model.js"; // ❗ YOU FORGOT THIS

export const toggleSubscribe = async (req, res) => {
    try {
        const userId = req.user._id;
        const { channelId } = req.params;

        const existing = await subscriberModel.findOne({
            user: userId,
            channel: channelId
        });

        if (existing) {
            // ❌ UNSUBSCRIBE
            await existing.deleteOne();

            await channelModel.findByIdAndUpdate(channelId, {
                $inc: { subscribersCount: -1 }
            });

            await userModel.findByIdAndUpdate(userId, {
                $pull: { subscribedChannels: channelId }
            });

            return res.json({
                success: true,
                subscribed: false   // 🔥 IMPORTANT FIX
            });
        }

        // ✅ SUBSCRIBE
        await subscriberModel.create({
            user: userId,
            channel: channelId
        });

        await channelModel.findByIdAndUpdate(channelId, {
            $inc: { subscribersCount: 1 }
        });

        await userModel.findByIdAndUpdate(userId, {
            $addToSet: { subscribedChannels: channelId }
        });

        return res.json({
            success: true,
            subscribed: true   // 🔥 IMPORTANT FIX
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



export const getSubscribersCount = async (req, res) => {
    try {
        const { channelId } = req.params;

        const count = await subscriberModel.countDocuments({
            channel: channelId
        });

        return res.json({
            success: true,
            subscribers: count
        });

    } catch {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUserSubscriptions = async (req, res) => {
    try {
        const userId = req.user._id;

        const subscriptions = await subscriberModel.find({
            user: userId
        }).populate("channel", "name handle avatar");

        return res.json({
            success: true,
            subscriptions
        });

    } catch {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getChannelSubscribers = async (req, res) => {
    try {
        const { channelId } = req.params;

        const subscribers = await subscriberModel
            .find({ channel: channelId })
            .populate("user", "username avatar");

        return res.json({
            success: true,
            subscribers
        });

    } catch {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const isSubscribed = async (req, res) => {
    try {
        const userId = req.user._id;
        const { channelId } = req.params;

        const exists = await subscriberModel.findOne({
            user: userId,
            channel: channelId
        });

        return res.json({
            success: true,
            subscribed: !!exists
        });

    } catch {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
