import {
  uploadFile,
  uploadFromPath,
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
      thumbnail: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop", // Temporary placeholder
      duration: 0,
      channel: req.user.channel,
      uploader: req.user._id,
      isPublished: false, // 🔒 Keep hidden until processed
      status: "PROCESSING"
    });

    videoId = video._id;

    await channelModel.findByIdAndUpdate(req.user.channel, {
      $inc: { videosCount: 1 }
    });

    // 🚀 STEP 2: RETURN SUCCESS IMMEDIATELY
    res.status(201).json({
      success: true,
      message: "Signal Injection Initiated. Verifying broadcast integrity...",
      video
    });

    // 🚀 STEP 3: PERFORM HEAVY TASKS IN BACKGROUND
    setImmediate(async () => {
      let uploadedVideo, uploadedThumbnail;
      try {
        console.log("🎬 BG: Processing video...");

        // 🎥 CONVERT VIDEO
        convertedPath = await convertToMp4(tempVideoPath);

        // ⏱ GET DURATION
        const duration = await new Promise((resolve) => {
          ffmpeg.ffprobe(convertedPath, (err, meta) => {
            resolve(Math.floor(meta?.format?.duration || 0));
          });
        });

        // ☁️ UPLOAD CONVERTED VIDEO (Using Path to avoid 413 error)
        uploadedVideo = await uploadFromPath(convertedPath, {
          filename: fileName.replace(/\.[^/.]+$/, ".mp4"),
          folder: "videos",
          resource_type: "video"
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

        // 🤖 START AI PIPELINE
        if (uploadedVideo && uploadedVideo.url) {
          await triggerAiPipeline(videoId, uploadedVideo.url, title, description, convertedPath);
        } else {
          console.warn("⚠️ BG: Skipping AI pipeline because video upload failed.");
        }

        // 📝 DB UPDATE: MARK AS READY
        await videoModel.findByIdAndUpdate(videoId, {
            videoUrl: uploadedVideo.url,
            thumbnail: uploadedThumbnail?.url || "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop",
            duration: duration || 0,
            isPublished: true, // 🔓 NOW VISIBLE
            status: "COMPLETED"
        });

        console.log("✅ BG: Processing complete!");

        // 🔒 Update with signed URL for consistency if needed (optional here as we update doc later)

      } catch (bgErr) {
        console.error("❌ BG ERROR:", bgErr.message);
        await videoModel.findByIdAndUpdate(videoId, { status: "FAILED" });
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
        const cleanUrl = url ? url.split("?")[0] : "";
        if (!cleanUrl) throw new Error("Video URL is required for AI processing");

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
          aiGenerated: {
            isAi: data.aiDetection?.isAi || false,
            modelUsed: data.aiDetection?.modelUsed || "",
            confidence: data.aiDetection?.confidence || 0
          },
          trustScore: data.finalVerdict === "TRUE" ? 100 : (data.finalVerdict === "FALSE" || data.finalVerdict === "DISINFORMATION" || deepfakeScore > 0.7) ? 10 : (data.finalVerdict === "PARTIALLY TRUE" || data.finalVerdict === "MISINFORMATION") ? 40 : 50,
          isFlagged: (data.finalVerdict === "FALSE" || data.finalVerdict === "DISINFORMATION" || deepfakeScore > 0.8) ? true : false,
          flagReason: data.finalVerdict === "DISINFORMATION" ? "AI Verification: Malicious Disinformation Detected" : data.finalVerdict === "FALSE" ? "AI Verification: False Information Detected" : deepfakeScore > 0.8 ? "AI Detection: High Deepfake Probability" : null
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

        // 🔐 PRIVACY & STATUS CHECK
        if (!video.isPublished || video.status !== "COMPLETED" || video.visibility === "private") {
            const isOwner = userId && video.uploader.toString() === userId.toString();
            if (!isOwner) {
                return res.status(403).json({ 
                    message: video.status === "PROCESSING" 
                        ? "Signal still initializing. Only curator has access." 
                        : "Access Denied: Private Signal" 
                });
            }
        }

        console.log(`🔍 [GET_VIDEO] Req: ${req.params.id} | User: ${userId || "GUEST"} | Owner: ${video.uploader}`);

        // 🔥 NO SECURITY CHECK FOR PUBLIC PAGES
        // We sign the URL to ensure it's accessible (Fixes 403)
        video.videoUrl = getSignedUrl(video.videoUrl);
        video.thumbnail = getSignedUrl(video.thumbnail);

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

        const userId = req.user?._id;

        const query = { status: { $ne: "PROCESSING" } };
        if (userId) {
            query.$or = [
                { visibility: "public" },
                { uploader: userId }
            ];
        } else {
            query.visibility = "public";
        }

        const videos = await videoModel
            .find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("channel", "name handle avatar");

        const total = await videoModel.countDocuments({});

        // 🔒 SIGN ALL URLS FOR HOME PAGE (Fixes 403)
        const signedVideos = videos.map(v => {
            const doc = v.toObject();
            doc.videoUrl = getSignedUrl(doc.videoUrl);
            doc.thumbnail = getSignedUrl(doc.thumbnail);
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
            doc.thumbnail = getSignedUrl(doc.thumbnail);
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

        const userId = req.user?._id;
        const query = {
            status: { $ne: "PROCESSING" },
            title: { $regex: q, $options: "i" }
        };

        if (userId) {
            query.$or = [
                { visibility: "public" },
                { uploader: userId }
            ];
        } else {
            query.visibility = "public";
        }

        const videos = await videoModel.find(query)
        .populate("channel", "name handle avatar")
        .limit(20);

        const signedVideos = videos.map(v => {
            const doc = v.toObject();
            doc.videoUrl = getSignedUrl(doc.videoUrl);
            doc.thumbnail = getSignedUrl(doc.thumbnail);
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
            { $match: { status: { $ne: "PROCESSING" }, visibility: "public" } },
            { $addFields: { score: { $add: ["$views", { $multiply: ["$likesCount", 2] }] } } },
            { $sort: { score: -1 } },
            { $limit: 20 }
        ]);
        const signedVideos = videos.map(v => {
            v.videoUrl = getSignedUrl(v.videoUrl);
            v.thumbnail = getSignedUrl(v.thumbnail);
            return v;
        });
        return res.json({ success: true, videos: signedVideos });
    } catch {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * 🛠 UPDATE VIDEO (Studio metadata edit)
 */
export const updateVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, visibility, isPublished } = req.body;
        const thumbFile = req.file;

        const video = await videoModel.findById(id);
        if (!video) return res.status(404).json({ message: "Video not found" });

        // 🔐 OWNER CHECK
        if (video.uploader.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized edit attempt" });
        }

        const updates = {};
        if (title) updates.title = title;
        if (description !== undefined) updates.description = description;
        if (visibility) updates.visibility = visibility;
        if (isPublished !== undefined) updates.isPublished = isPublished === "true" || isPublished === true;

        if (thumbFile) {
            const uploaded = await uploadFile({
                buffer: thumbFile.buffer,
                filename: `update-${Date.now()}-${thumbFile.originalname}`,
                folder: "thumbnails"
            });
            updates.thumbnail = uploaded.url;
        }

        const updatedVideo = await videoModel.findByIdAndUpdate(id, updates, { new: true });
        
        // Sign URLs for response
        const doc = updatedVideo.toObject();
        doc.videoUrl = getSignedUrl(doc.videoUrl);
        doc.thumbnail = getSignedUrl(doc.thumbnail);

        return res.json({
            success: true,
            message: "Archives updated successfully",
            video: doc
        });

    } catch (err) {
        console.error("Update error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};