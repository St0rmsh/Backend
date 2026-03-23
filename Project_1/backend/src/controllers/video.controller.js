import { uploadFile, deleteFile } from "../services/storage.service.js";
import videoModel from "../models/video.model.js";
import ffmpeg from "fluent-ffmpeg";
import ffmpegpath from "ffmpeg-static";
import { SearchAndAskAI } from "../services/ai.service.js";
import fs from "fs";
import channelModel from "../models/channel.model.js";
import ffprobePath from "ffprobe-static";

ffmpeg.setFfmpegPath(ffmpegpath);
ffmpeg.setFfprobePath(ffprobePath.path); 

export const videoUpload = async (req, res) => {
    let uploadedVideo = null;
    let uploadedThumbnail = null;
    let thumbnailPath = null;

    const file = req.file;

    try {
        const { title, description } = req.body;

        // ✅ AUTH
        if (!req.user?._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!req.user?.channel) {
            return res.status(400).json({ message: "Create a channel first" });
        }

        // ✅ VALIDATION
        if (!file) return res.status(400).json({ message: "Video required" });
        if (!title || !description) {
            return res.status(400).json({ message: "All fields required" });
        }

        // ✅ READ FILE BUFFER

        uploadedVideo = await uploadFile({
           filePath: file.path,
    filename: file.filename

        });

        if (!uploadedVideo?.url) throw new Error("Video upload failed");

        // ✅ GET DURATION
        const duration = await new Promise((resolve, reject) => {
            ffmpeg.ffprobe(file.path, (err, meta) => {
                if (err) return reject(err);
                resolve(Math.floor(meta?.format?.duration || 0));
            });
        });

        // ✅ CREATE THUMBNAIL
        await fs.promises.mkdir("uploads/thumbnails", { recursive: true });

        const fileName = `${Date.now()}.png`;
        thumbnailPath = `uploads/thumbnails/${fileName}`;

        try {
            await new Promise((resolve, reject) => {
                ffmpeg(file.path)
                    .screenshots({
                        count: 1,
                        filename: fileName,
                        folder: "uploads/thumbnails"
                    })
                    .on("end", resolve)
                    .on("error", reject);
            });

     uploadedThumbnail = await uploadFile({
    filePath: thumbnailPath, 
    filename: fileName
});

        } catch (err) {
            console.log("Thumbnail failed:", err);
            uploadedThumbnail = {
                url: "https://via.placeholder.com/1280x720.png",
                fileId: null
            };
        }

        // ✅ SAVE VIDEO
        const video = await videoModel.create({
            title,
            description,
            videoUrl: uploadedVideo.url,
            thumbnail: uploadedThumbnail.url,
            duration,
            channel: req.user.channel,
            uploader: req.user._id,
            views: 0,
            likes: 0,
            dislikes: 0,
            tags: [],
            category: "general",
            visibility: "public",
            isPublished: true,
            verification: {
                verdict: "UNKNOWN",
                confidence: 0,
                summary: "",
                sources: []
            }
        });

        // ✅ UPDATE CHANNEL COUNT (SAFE)
        await channelModel.findByIdAndUpdate(
            req.user.channel,
            { $inc: { videosCount: 1 } },
            { new: true }
        );

        // ✅ BACKGROUND AI
        SearchAndAskAI({ query: `${title} ${description}` })
            .then(async (ai) => {
               if (ai?.success && ai.data) {
                await videoModel.findByIdAndUpdate(video._id, {
                    verification: {
                    summary: ai.data.summary || "",
                    claims: ai.data.claims || [],
                    finalVerdict: ai.data.finalVerdict || "UNKNOWN",
                    confidence: ai.data.confidence || 0,
                    truth: ai.data.truth || "",
                    issues: ai.data.issues || [],
                    sources: ai.data.sources || [],
                    checkedAt: new Date()
                }
            });
        }

            })
            .catch(() => {});

      return res.status(201).json({
    success: true,
    video,
    message: "Video uploaded. Verification in progress..."
});

    } catch (err) {
        console.error("Upload error:", err);

        if (uploadedVideo?.fileId) await deleteFile(uploadedVideo.fileId);
        if (uploadedThumbnail?.fileId) await deleteFile(uploadedThumbnail.fileId);

        return res.status(500).json({ message: "Internal Server Error" });

    } finally {
        try {
            if (file?.path && fs.existsSync(file.path)) {
                await fs.promises.unlink(file.path);
            }

            if (thumbnailPath && fs.existsSync(thumbnailPath)) {
                await fs.promises.unlink(thumbnailPath);
            }
        } catch {}
    }
};



export const getVideo = async (req, res) => {
    try {
        const video = await videoModel
            .findById(req.params.id)
            .populate("channel", "name handle avatar");

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        // ✅ increment views
        await videoModel.findByIdAndUpdate(video._id, {
            $inc: { views: 1 }
        });

        return res.status(200).json({
            success: true,
            video
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getAllVideos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const videos = await videoModel
            .find({ isPublished: true })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("channel", "name handle avatar");

        const total = await videoModel.countDocuments({ isPublished: true });

        return res.status(200).json({
            success: true,
            page,
            totalPages: Math.ceil(total / limit),
            totalVideos: total,
            videos
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getTrendingVideos = async (req, res) => {
    try {
        const videos = await videoModel.aggregate([
            {
                $addFields: {
                    score: {
                        $add: [
                            "$views",
                            { $multiply: ["$likes", 2] }
                        ]
                    }
                }
            },
            { $sort: { score: -1 } },
            { $limit: 20 }
        ]);

        return res.status(200).json({
            success: true,
            videos
        });

    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const searchVideos = async (req, res) => {
    try {
        const q = req.query.q;

        const videos = await videoModel.find({
            $text: { $search: q }
        }).limit(20);

        return res.status(200).json({
            success: true,
            videos
        });

    } catch {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
