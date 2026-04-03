import {
  uploadFile,
  deleteFile
} from "../services/storage.service.js";

import videoModel from "../models/video.model.js";
import channelModel from "../models/channel.model.js";

import { SearchAndAskAI } from "../services/ai.service.js";
import { transcribeVideo } from "../services/transcription.service.js";
import { analyzeVideoForDeepFake } from "../services/VideoAi.service.js";

import ffmpeg from "fluent-ffmpeg";
import ffmpegpath from "ffmpeg-static";
import ffprobePath from "ffprobe-static";

import fs from "fs";
import { saveTempFile } from "../utils/save.temp.js";
import { convertToMp4 } from "../utils/convertVideo.js";

ffmpeg.setFfmpegPath(ffmpegpath);
ffmpeg.setFfprobePath(ffprobePath.path);

export const videoUpload = async (req, res) => {
  let uploadedVideo, uploadedThumbnail;
  let tempVideoPath, convertedPath, tempThumbPath;

  try {
    const { title, description } = req.body;
    const file = req.file;

    // 🔐 AUTH CHECK
    if (!req.user?._id)
      return res.status(401).json({ message: "Unauthorized" });

    if (!req.user?.channel)
      return res.status(400).json({ message: "Create channel first" });

    if (!file)
      return res.status(400).json({ message: "Video required" });

    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;

    // 📦 SAVE TEMP FILE
    tempVideoPath = await saveTempFile(file.buffer, fileName);

    // 🔥 CONVERT VIDEO (FIX AUDIO ISSUE)
    convertedPath = await convertToMp4(tempVideoPath);

    const videoBuffer = await fs.promises.readFile(convertedPath);

    // ☁️ UPLOAD CONVERTED VIDEO
    uploadedVideo = await uploadFile({
      buffer: videoBuffer,
      filename: fileName.replace(/\.[^/.]+$/, ".mp4"),
      folder: "videos"
    });

    // ⏱ GET DURATION
    const duration = await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(convertedPath, (err, meta) => {
        if (err) return reject(err);
        resolve(Math.floor(meta?.format?.duration || 0));
      });
    });

    // 🖼 GENERATE THUMBNAIL
    const thumbName = `thumb-${Date.now()}.png`;
    tempThumbPath = `temp/${thumbName}`;

    await fs.promises.mkdir("temp", { recursive: true });

    await new Promise((resolve, reject) => {
      ffmpeg(convertedPath)
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

    // 💾 SAVE VIDEO IN DB
    const video = await videoModel.create({
      title,
      description,
      videoUrl: uploadedVideo.url,
      thumbnail: uploadedThumbnail.url,
      duration,
      channel: req.user.channel,
      uploader: req.user._id,
      deepfakeScore: 0
    });

    await channelModel.findByIdAndUpdate(req.user.channel, {
      $inc: { videosCount: 1 }
    });

    // ==================================================
    // 🔥 BACKGROUND AI PROCESS
    // ==================================================
    const aiVideoPath = `temp/ai-${Date.now()}.mp4`;
    await fs.promises.copyFile(convertedPath, aiVideoPath);

    setImmediate(async () => {
      try {
        console.log("🚀 AI START");

        const cleanUrl = uploadedVideo.url.split("?")[0];

        const [transcript, deepfakeScore] = await Promise.all([
          transcribeVideo(cleanUrl),
          analyzeVideoForDeepFake(aiVideoPath)
        ]);

        const ai = await SearchAndAskAI({
          query: `${title}\n${description}\n${transcript || ""}`
        });

        const data = ai?.data || {};

        const isFlagged =
          data.finalVerdict === "FALSE" && data.confidence > 70;

        const trustScore =
          data.finalVerdict === "TRUE" ? 100 :
          data.finalVerdict === "PARTIALLY TRUE" ? 60 :
          data.finalVerdict === "FALSE" ? 20 : 0;

        await videoModel.findByIdAndUpdate(video._id, {
          transcript,
          deepfakeScore,
          trustScore,
          verification: {
            ...data,
            checkedAt: new Date()
          },
          isFlagged,
          flagReason: isFlagged ? "Potential misinformation" : ""
        });

        console.log("✅ AI DONE");

      } catch (err) {
        console.log("❌ AI ERROR:", err.message);

      } finally {
        // 🧹 CLEAN AI FILE
        if (fs.existsSync(aiVideoPath)) {
          await fs.promises.unlink(aiVideoPath);
        }
      }
    });

    // ✅ RESPONSE
    return res.status(201).json({
      success: true,
      video
    });

  } catch (err) {
    console.error(err);

    // 🧹 ROLLBACK UPLOADS
    if (uploadedVideo?.fileId) {
      await deleteFile(uploadedVideo.fileId);
    }

    if (uploadedThumbnail?.fileId) {
      await deleteFile(uploadedThumbnail.fileId);
    }

    return res.status(500).json({
      message: "Internal Server Error"
    });

  } finally {
    // 🧹 CLEAN TEMP FILES
    try {
      if (tempVideoPath && fs.existsSync(tempVideoPath)) {
        await fs.promises.unlink(tempVideoPath);
      }

      if (convertedPath && fs.existsSync(convertedPath)) {
        await fs.promises.unlink(convertedPath);
      }

      if (tempThumbPath && fs.existsSync(tempThumbPath)) {
        await fs.promises.unlink(tempThumbPath);
      }

    } catch (cleanupErr) {
      console.log("Cleanup error:", cleanupErr.message);
    }
  }
};











export const getVideo = async (req, res) => {
    try {
        const userId = req.user?._id;

        const video = await videoModel
            .findById(req.params.id)
            .populate("channel", "name handle avatar");

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        // 🔥 SECURITY CHECK
        const isOwner =
            video.uploader?.toString() === userId?.toString();

        if (!video.isPublished && !isOwner) {
            return res.status(403).json({
                message: "This video is private"
            });
        }

        return res.status(200).json({
            success: true,
            video
        });

    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getMyVideos = async (req, res) => {
    try {
        const userId = req.user._id;

        const videos = await videoModel
            .find({ uploader: userId })
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            videos
        });

    } catch {
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


export const deleteVideo = async (req, res) => {
  const userId = req.user._id;

  const video = await videoModel.findById(req.params.id);

  if (!video) return res.status(404).json({ message: "Not found" });

  if (video.uploader.toString() !== userId.toString()) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await video.deleteOne();

  res.json({ success: true });
};

