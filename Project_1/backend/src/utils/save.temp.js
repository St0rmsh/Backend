import fs from "fs";
import path from "path";

export const saveTempFile = async (buffer, filename) => {
    const tempPath = path.join("temp", filename);
    await fs.promises.mkdir("temp", { recursive: true });
    await fs.promises.writeFile(tempPath, buffer);
    return tempPath;
};
