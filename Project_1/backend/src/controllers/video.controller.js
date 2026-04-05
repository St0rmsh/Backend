import {
  uploadFile,
  deleteFile,
  getSignedUrl
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

/**
 * ⚡️ UPLOAD VIDEO (Optimized with Background Processing)
 * Returns a response in ~1-2 seconds after receiving the file,
 * then converts and uploads in the background.
 */
export const videoUpload = async (req, res) => {
  let tempVideoPath, convertedPath, tempThumbPath;
  let videoId;

  try {
    const { title, description } = req.body;
    const file = req.files?.video?.[0];
    const thumbFile = req.files?.thumbnail?.[0];

    // 🔐 AUTH CHECK
    if (!req.user?._id)
      return res.status(401).json({ message: "Unauthorized" });

    if (!req.user?.channel)
      return res.status(400).json({ message: "Create channel first" });

    if (!file)
      return res.status(400).json({ message: "Video required" });

    // 🎯 INITIAL SETUP
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    tempVideoPath = await saveTempFile(file.buffer, fileName);

    // 🚀 STEP 1: CREATE PROCESSING RECORD
    const video = await videoModel.create({
      title,
      description: description || "",
      videoUrl: "", // 🔄 Will be updated after background processing
      thumbnail: "https://ik.imagekit.io/p7b10nfhs/placeholder-track.jpg", // Temporary placeholder
      duration: 0,
      channel: req.user.channel,
      uploader: req.user._id,
      isPublished: false, // 🔒 Keep hidden until processed
    });

    videoId = video._id;

    await channelModel.findByIdAndUpdate(req.user.channel, {
      $inc: { videosCount: 1 }
    });

    // 🚀 STEP 2: RETURN SUCCESS IMMEDIATELY
    res.status(201).json({
      success: true,
      message: "Video upload started! Generating premium copy...",
      video
    });

    // 🚀 STEP 3: PERFORM HEAVY TASKS IN BACKGROUND
    setImmediate(async () => {
      let uploadedVideo, uploadedThumbnail;
      try {
        console.log("🎬 BG: Processing video...");

        // 🎥 CONVERT VIDEO
        convertedPath = await convertToMp4(tempVideoPath);
        const videoBuffer = await fs.promises.readFile(convertedPath);

        // ⏱ GET DURATION
        const duration = await new Promise((resolve) => {
          ffmpeg.ffprobe(convertedPath, (err, meta) => {
            resolve(Math.floor(meta?.format?.duration || 0));
          });
        });

        // ☁️ UPLOAD CONVERTED VIDEO
        uploadedVideo = await uploadFile({
          buffer: videoBuffer,
          filename: fileName.replace(/\.[^/.]+$/, ".mp4"),
          folder: "videos"
        });

        // 🖼 THUMBNAIL LOGIC
        if (thumbFile) {
           uploadedThumbnail = await uploadFile({
              buffer: thumbFile.buffer,
              filename: `${Date.now()}-thumb.png`,
              folder: "thumbnails"
           });
        } else {
            const thumbName = `thumb-${Date.now()}.png`;
            tempThumbPath = `temp/${thumbName}`;
            await fs.promises.mkdir("temp", { recursive: true });

            await new Promise((resolve) => {
              ffmpeg(convertedPath)
                .screenshots({ count: 1, filename: thumbName, folder: "temp" })
                .on("end", resolve)
                .on("error", resolve); // Try to proceed even if thumbnail fails
            });

            if (fs.existsSync(tempThumbPath)) {
                const thumbBuffer = await fs.promises.readFile(tempThumbPath);
                uploadedThumbnail = await uploadFile({
                    buffer: thumbBuffer,
                    filename: thumbName,
                    folder: "thumbnails"
                });
            }
        }

        // 📝 DB UPDATE: MARK AS READY
        await videoModel.findByIdAndUpdate(videoId, {
            videoUrl: uploadedVideo.url,
            thumbnail: uploadedThumbnail?.url || "https://ik.imagekit.io/p7b10nfhs/placeholder-track.jpg",
            duration: duration || 0,
            isPublished: true, // 🔓 NOW VISIBLE
        });

        console.log("✅ BG: Processing complete!");

        // 🤖 START AI PIPELINE
        await triggerAiPipeline(videoId, uploadedVideo.url, title, description, convertedPath);

        // 🔒 Update with signed URL for consistency if needed (optional here as we update doc later)

      } catch (bgErr) {
        console.error("❌ BG ERROR:", bgErr.message);
      } finally {
        // CLEANUP
        try {
            if (tempVideoPath && fs.existsSync(tempVideoPath)) await fs.promises.unlink(tempVideoPath);
            if (convertedPath && fs.existsSync(convertedPath)) await fs.promises.unlink(convertedPath);
            if (tempThumbPath && fs.existsSync(tempThumbPath)) await fs.promises.unlink(tempThumbPath);
        } catch (e) {}
      }
    });

  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/** AI PIPELINE INTERNAL HELPER */
async function triggerAiPipeline(videoId, url, title, description, videoPath) {
    const aiVideoPath = `temp/ai-${Date.now()}.mp4`;
    try {
        await fs.promises.copyFile(videoPath, aiVideoPath);
        const cleanUrl = url.split("?")[0];

        const [transcript, deepfakeScore] = await Promise.all([
          transcribeVideo(cleanUrl),
          analyzeVideoForDeepFake(aiVideoPath)
        ]);

        const ai = await SearchAndAskAI({ query: `${title}\n${description}\n${transcript || ""}` });
        const data = ai?.data || {};

        console.log(`🤖 AI Result: ${data.finalVerdict} | Deepfake: ${deepfakeScore}`);

        await videoModel.findByIdAndUpdate(videoId, {
          transcript,
          deepfakeScore,
          verification: { ...data, checkedAt: new Date() },
          trustScore: data.finalVerdict === "TRUE" ? 100 : (data.finalVerdict === "FALSE" || deepfakeScore > 0.7) ? 20 : 50,
          isFlagged: (data.finalVerdict === "FALSE" || deepfakeScore > 0.8) ? true : false,
          flagReason: data.finalVerdict === "FALSE" ? "AI Verification: False Information Detected" : deepfakeScore > 0.8 ? "AI Detection: High Deepfake Probability" : null
        });

    } catch (e) {
        console.log("AI Pipeline error:", e.message);
    } finally {
        if (fs.existsSync(aiVideoPath)) await fs.promises.unlink(aiVideoPath);
    }
}


export const getVideo = async (req, res) => {
    try {
        const userId = req.user?._id;

        const video = await videoModel
            .findById(req.params.id)
            .populate("channel", "name handle avatar");

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        console.log(`🔍 [GET_VIDEO] Req: ${req.params.id} | User: ${userId || "GUEST"} | Owner: ${video.uploader}`);

        // 🔥 NO SECURITY CHECK FOR PUBLIC PAGES
        // We sign the URL to ensure it's accessible (Fixes 403)
        video.videoUrl = getSignedUrl(video.videoUrl);

        return res.status(200).json({ success: true, video });

    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAllVideos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const videos = await videoModel
            .find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("channel", "name handle avatar");

        const total = await videoModel.countDocuments({});

        // 🔒 SIGN ALL URLS FOR HOME PAGE (Fixes 403)
        const signedVideos = videos.map(v => {
            const doc = v.toObject();
            doc.videoUrl = getSignedUrl(doc.videoUrl);
            return doc;
        });

        return res.status(200).json({
            success: true,
            videos: signedVideos
        });

    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getMyVideos = async (req, res) => {
    try {
        const userId = req.user._id;
        const videos = await videoModel.find({ uploader: userId }).sort({ createdAt: -1 });
        const signedVideos = videos.map(v => {
            const doc = v.toObject();
            doc.videoUrl = getSignedUrl(doc.videoUrl);
            return doc;
        });
        return res.json({ success: true, videos: signedVideos });
    } catch {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const searchVideos = async (req, res) => {
    try {
        const q = req.query.q;
        if (!q) return res.json({ success: true, videos: [] });

        const videos = await videoModel.find({
            isPublished: { $ne: false },
            title: { $regex: q, $options: "i" }
        })
        .populate("channel", "name handle avatar")
        .limit(20);

        const signedVideos = videos.map(v => {
            const doc = v.toObject();
            doc.videoUrl = getSignedUrl(doc.videoUrl);
            return doc;
        });

        return res.status(200).json({ success: true, videos: signedVideos });

    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteVideo = async (req, res) => {
    try {
        const video = await videoModel.findById(req.params.id);
        if (!video) return res.status(404).json({ message: "Video not found" });

        if (video.uploader.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await videoModel.findByIdAndDelete(req.params.id);
        return res.json({ success: true, message: "Video deleted" });
    } catch {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getTrendingVideos = async (req, res) => {
    try {
        const videos = await videoModel.aggregate([
            { $addFields: { score: { $add: ["$views", { $multiply: ["$likesCount", 2] }] } } },
            { $sort: { score: -1 } },
            { $limit: 20 }
        ]);
        const signedVideos = videos.map(v => {
            v.videoUrl = getSignedUrl(v.videoUrl);
            return v;
        });
        return res.json({ success: true, videos: signedVideos });
    } catch {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};