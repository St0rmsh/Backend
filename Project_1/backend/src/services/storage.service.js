import { v2 as cloudinary } from "cloudinary";
import config from "../config/config.js";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

export const uploadFile = async ({ buffer, filename, folder = "YtCl" }) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "auto",
          public_id: filename.split(".")[0],
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return reject(new Error("Upload failed"));
          }
          resolve({
            url: result.secure_url,
            fileId: result.public_id,
            ...result
          });
        }
      );

      Readable.from(buffer).pipe(uploadStream);
    });
  } catch (error) {
    console.error("Upload error:", error.message);
    throw new Error("Upload failed");
  }
};

export const uploadFromPath = async (filePath, { folder = "YtCl", filename, resource_type = "auto" } = {}) => {
  try {
    console.log(`☁️ Cloudinary: Uploading large file from path: ${filePath}`);
    const result = await cloudinary.uploader.upload_large(filePath, {
      folder,
      resource_type,
      chunk_size: 5 * 1024 * 1024, // 5MB chunks (minimal for Cloudinary)
      public_id: filename ? filename.split(".")[0] : undefined,
    });
    
    console.log(`✅ Cloudinary: Upload successful! URL: ${result.secure_url}`);
    
    return {
      url: result.secure_url,
      fileId: result.public_id,
      ...result
    };
  } catch (error) {
    console.error("Cloudinary upload_large error detail:", {
      message: error.message,
      http_code: error.http_code,
      name: error.name
    });
    throw new Error(`Upload failed: ${error.message}`);
  }
};

export const uploadToImageKit = async (file) => {
  // Keeping name for compatibility, but using Cloudinary
  try {
    const res = await uploadFile({
      buffer: file.buffer,
      filename: file.originalname,
      folder: "yt-clone"
    });
    return res.url;
  } catch (error) {
    console.error("UploadToImageKit (Cloudinary) error:", error);
    throw error;
  }
};

export const deleteFile = async (publicId) => {
  try {
    if (!publicId) return null;
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Delete error:", error);
    return null;
  }
};

export const getSignedUrl = (url) => {
  // Cloudinary URLs are generally accessible if public. 
  // If private assets are used, we'd use cloudinary.utils.private_download_url
  // For now, return the URL as is, or apply transformations if needed.
  try {
    if (!url || !url.startsWith("http")) return url;
    return url;
  } catch (e) {
    return url;
  }
};