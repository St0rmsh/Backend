import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = "uploads/videos";

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, uploadDir),
    filename: (_, file, cb) => {
        const ext = path.extname(file.originalname) || ".mp4";
        const name = Date.now() + "-" + Math.random().toString(36).slice(2);
        cb(null, name + ext);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (_, file, cb) => {
        const allowed = ["video/mp4", "video/webm", "video/mkv"];
        if (allowed.includes(file.mimetype.toLowerCase())) {
            cb(null, true);
        } else {
            cb(new Error("Only MP4, WEBM, MKV allowed"));
        }
    }
});

export default upload;
