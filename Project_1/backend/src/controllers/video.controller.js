import { uploadFile, deleteFile } from "../services/storage.service.js";
import videoModel from "../models/video.model.js";
import { SearchAndAskAI } from "../services/ai.service.js";
import channelModel from "../models/channel.model.js";
import ffmpeg from "fluent-ffmpeg";
import ffmpegpath from "ffmpeg-static";
import ffprobePath from "ffprobe-static";
import { saveTempFile } from "../utils/save.temp.js";
import {transcribeVideo} from "../services/transcription.service.js"
import fs from "fs";


ffmpeg.setFfmpegPath(ffmpegpath);
ffmpeg.setFfprobePath(ffprobePath.path);



export const videoUpload = async (req, res) => {
    let uploadedVideo = null;
    let uploadedThumbnail = null;
    let tempVideoPath = null;
    let tempThumbPath = null;

    try {
        const { title, description } = req.body;
        const file = req.file;

        if (!req.user?._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!req.user?.channel) {
            return res.status(400).json({ message: "Create a channel first" });
        }

        if (!file) {
            return res.status(400).json({ message: "Video required" });
        }

        if (!title || !description) {
            return res.status(400).json({ message: "All fields required" });
        }

        const safeName = file.originalname.replace(/\s+/g, "_");
        const fileName = `${Date.now()}-${safeName}`;

        // ✅ TEMP SAVE
        tempVideoPath = await saveTempFile(file.buffer, fileName);

        // ✅ UPLOAD VIDEO
        uploadedVideo = await uploadFile({
            buffer: file.buffer,
            filename: fileName,
            folder: "videos"
        });

        // ✅ GET DURATION
        const duration = await new Promise((resolve, reject) => {
            ffmpeg.ffprobe(tempVideoPath, (err, meta) => {
                if (err) return reject(err);
                resolve(Math.floor(meta?.format?.duration || 0));
            });
        });

        // ✅ THUMBNAIL
        await fs.promises.mkdir("temp", { recursive: true });

        const thumbName = `thumb-${Date.now()}.png`;
        tempThumbPath = `temp/${thumbName}`;

        await new Promise((resolve, reject) => {
            ffmpeg(tempVideoPath)
                .screenshots({
                    count: 1,
                    filename: thumbName,
                    folder: "temp"
                })
                .on("end", resolve)
                .on("error", reject);
        });

        const thumbBuffer = await fs.promises.readFile(tempThumbPath);

        uploadedThumbnail = await uploadFile({
            buffer: thumbBuffer,
            filename: thumbName,
            folder: "thumbnails"
        });

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
            likesCount: 0,
            dislikesCount: 0,
            transcript: "",
            trustScore: 0,
            tags: [],
            category: "general",
            visibility: "public",
            isPublished: true,
            verification: {
                summary: "",
                claims: [],
                finalVerdict: "UNKNOWN",
                confidence: 0,
                sources: []
            }
        });

        // ✅ update channel
        await channelModel.findByIdAndUpdate(
            req.user.channel,
            { $inc: { videosCount: 1 } }
        );

        // 🔥 BACKGROUND AI (NON-BLOCKING)
        setImmediate(async () => {
            try {
                console.log("🚀 AI started...");

                const transcript = await transcribeVideo(uploadedVideo.url);

                const urls =
                    description.match(/https?:\/\/[^\s]+/g) || [];

                const result = await SearchAndAskAI({
                    query: `
Video Title: ${title}

Description: ${description}

Transcript:
${transcript || "No transcript"}

Sources:
${urls.join("\n")}
`
                });

                if (result.success && result.data) {

                    const isFlagged =
                        result.data.finalVerdict === "FALSE" &&
                        result.data.confidence > 70;

                    const trustScore =
                        result.data.finalVerdict === "TRUE" ? 100 :
                        result.data.finalVerdict === "PARTIALLY TRUE" ? 60 :
                        result.data.finalVerdict === "FALSE" ? 20 : 0;

                    await videoModel.findByIdAndUpdate(video._id, {
                        transcript,
                        trustScore,
                        verification: {
                            ...result.data,
                            checkedAt: new Date()
                        },
                        isFlagged,
                        flagReason: isFlagged
                            ? "Potential misinformation"
                            : ""
                    });

                    console.log("✅ AI verification saved");
                }

            } catch (err) {
                console.log("❌ AI failed:", err.message);
            }
        });

        return res.status(201).json({
            success: true,
            video,
            message: "Uploaded successfully"
        });

    } catch (err) {
        console.error("Upload error:", err);

        if (uploadedVideo?.fileId)
            await deleteFile(uploadedVideo.fileId);

        if (uploadedThumbnail?.fileId)
            await deleteFile(uploadedThumbnail.fileId);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    } finally {
        if (tempVideoPath && fs.existsSync(tempVideoPath)) {
            await fs.promises.unlink(tempVideoPath);
        }

        if (tempThumbPath && fs.existsSync(tempThumbPath)) {
            await fs.promises.unlink(tempThumbPath);
        }
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
                            { $multiply: ["$likesCount", 2] }
                        ]
                    }
                }
            },
            { $sort: { score: -1 } },
            { $limit: 20 }
        ]);

        return res.json({ success: true, videos });

    } catch {
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
