import ImageKit from "@imagekit/nodejs";
import config from "../config/config.js";

const imagekit = new ImageKit({
  publicKey: config.IMAGEKIT_PUBLIC_KEY,
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
});

/**
 * Uploads a file to ImageKit with retry logic
 * @param {Buffer} fileBuffer - The file content as a Buffer
 * @param {string} originalName - Original filename
 * @param {string} folder - Destination folder in ImageKit
 * @param {number} retries - Number of retry attempts (default: 3)
 */
export const uploadToImageKit = async (fileBuffer, originalName, folder = "/videos", retries = 3) => {
  let attempt = 0;
  
  while (attempt < retries) {
    try {
      console.log(`🚀 UPLOAD_START: Attempt ${attempt + 1} for ${originalName}`);
      
      const result = await imagekit.files.upload({
        file: fileBuffer,
        fileName: `${Date.now()}-${originalName}`,
        folder: folder,
        useUniqueFileName: true,
      });

      if (!result || !result.url) {
        throw new Error("ImageKit upload response missing URL");
      }

      console.log("UPLOAD_SUCCESS", {
        fileId: result.fileId,
        url: result.url,
        name: result.name,
      });

      return {
        url: result.url,
        fileId: result.fileId,
        name: result.name,
        ...result
      };
    } catch (error) {
      attempt++;
      console.error(`UPLOAD_FAILED: Attempt ${attempt} failed for ${originalName}`, {
        error: error.message,
        stack: error.stack
      });

      if (attempt >= retries) {
        throw new Error(`ImageKit upload failed after ${retries} attempts: ${error.message}`);
      }

      // Exponential backoff
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

export default {
  uploadToImageKit,
};
