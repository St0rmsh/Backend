import {ImageKit} from "@imagekit/nodejs";
import config from "../config/config.js";
import fs from "fs";

const imageKit = new ImageKit({
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
    publicKey: config.IMAGEKIT_PUBLIC_KEY,
});

export const uploadFile = async ({ filePath, filename, folder = "YtCl" }) => {
    try {
        const file = await imageKit.files.upload({
            file:  fs.createReadStream(filePath), 
            fileName: filename,
            folder
        });

        return file;
    } catch (error) {
        console.error("Upload error FULL:", error);
        console.error("Upload error MESSAGE:", error.message);
        console.error("Upload error STACK:", error.stack);
        throw new Error("Upload failed");
    }
};

export const deleteFile = async (fileId) => {
    try {
        if (!fileId) return null;

        return await imageKit.delete(fileId); 

    } catch (error) {
        console.error("Delete error:", error);
        return null;
    }
};

