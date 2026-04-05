import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import config from "../config/config.js";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

// Setup Cloudinary Storage for Multer
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "yt_clone/videos",
    resource_type: "video", // Important for videos
    allowed_formats: ["mp4", "mkv", "webm", "avi"],
    transformation: [{ quality: "auto" }] // Compression
  },
});

const uploadVideoCloudinary = multer({ 
    storage: videoStorage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

export { uploadVideoCloudinary, cloudinary };
