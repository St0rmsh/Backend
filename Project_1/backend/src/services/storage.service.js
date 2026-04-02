import { ImageKit } from "@imagekit/nodejs";
import config from "../config/config.js";
import {Readable} from "stream"

const imageKit = new ImageKit({
    publicKey: config.IMAGEKIT_PUBLIC_KEY,
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: config.IMAGEKIT_URL_ENDPOINT
});

export const uploadFile = async ({ buffer, filename, folder = "YtCl" }) => {
    try {

        const stream = Readable.from(buffer);
        
        const file = await imageKit.files.upload({
            file: stream,
            fileName: filename,
            folder
        });

        return file;

    } catch (error) {
        console.error("Upload error:", error.message);
        throw new Error("Upload failed");
    }
};

export const uploadToImageKit = async (file) => {
  const base64 = file.buffer.toString("base64");

  const res = await imageKit.files.upload({
    file: base64,
    fileName: file.originalname,
    folder: "/yt-clone"
  });

  return res.url; // ✅ store this in DB
};

export const deleteFile = async (fileId) => {
    try {
        if (!fileId) return null;
        return await imageKit.files.deleteFile(fileId);
    } catch (error) {
        console.error("Delete error:", error);
        return null;
    }
};
