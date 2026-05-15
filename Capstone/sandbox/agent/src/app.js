import express from "express";
import morgan from "morgan";
import fs from "fs"
import path from "path"


const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const WORKING_DIR = "/workspace"

app.get("/",(req,res)=>{
    res.status(200).json({
        message:"Hello from Sandbox Agent",
        status:200,
    })
})



// @route GET /read-file read files 
// @description Reads requested files in query parameters and returns as JSON  from the /workspace directory.
// @param files - comma separated file paths
// @returns {object} as JSON, with the file names as keys and file contents as values
// Example: { 
//   "file1.txt": "content1", 
//   "file2.txt": "content2" 
// }

app.get("/read-file", async (req, res) => {

    const files = req.query.files;

    if (!files) {
        return res.status(400).json({
            message: "Files are required",
            status: 400,
        });
    }

    const fileList = files.split(",");

    const results = await Promise.all(

        fileList.map(async (file) => {

            const absolutePath = path.join(WORKING_DIR, file);

            try {

                const data = await fs.promises.readFile(
                    absolutePath,
                    "utf-8"
                );

                return { [absolutePath.replace(WORKING_DIR,"")]: data };

            } catch (error) {

                return {
                    [absolutePath.replace(WORKING_DIR,"")]: `File not found : ${error.message}`
                };

            }

        })

    );

    return res.status(200).json({
        message: "File read successfully",
        data: results,
    });

});


// @route PATCH update file
// @description Updates the specified file in the request body. the request body should contain a property "updates" which is an array of objects with file and content
// @param updates - Array of objects with file and content
// @returns {object} as JSON, with the absolute path and success message
// Example: {
//    "updates": [
//        { "file": "file1.txt", "content": "content1" },
//        { "file": "file2.txt", "content": "content2" }
//    ]
// }

app.patch("/update-file", async(req,res)=>{

    const updates = req.body.updates;

    if (!updates || !Array.isArray(updates)) {
        return res.status(400).json({
            message: "Updates must be an array of objects with file and content",
            status: 400,
        })
    }
const result = await Promise.all(updates.map(async(update)=>{

    const {filePath,content} = update

    const absolutePath = path.join(WORKING_DIR, filePath);

    try {
    await fs.promises.writeFile(absolutePath, content , "utf-8");
        return { [absolutePath]: "File updated successfully" };
    } catch (error) {
        return { [absolutePath]: `File not found : ${error.message}` };
    }

}))

    res.status(200).json({
        message: "File updated successfully",
        data: result
    })

})



// @route   POST  /create-file
// @description Creates a new folder or file and file in folders and files with content in the requested body. the requested body should contain a property "file" with a json Array of Object with "file" and "content" properties  , if folders are not present they are created recursively
// @param filePath - The path to the file to create
// @param content - The content to write to the file
// @returns {object} as JSON, with the absolute path and success message
// Example: {
//    "filePath": "file1.txt",
//    "content": "content1"
// }

app.post("/create-file", async(req,res)=>{
    const files = req.body.files;

    if (!files || !Array.isArray(files)) {
        return res.status(400).json({
            message: "Files must be an array of objects with file and content",
            status: 400,
        })
    }

    const results = await Promise.all(files.map(async(file)=>{

        const {filePath,content} = file

        const absolutePath = path.join(WORKING_DIR, filePath);

        try {
        await fs.promises.mkdir(path.dirname(absolutePath), { recursive: true });
        await fs.promises.writeFile(absolutePath, content , "utf-8");
            return { [absolutePath]: "File created successfully" };
        } catch (error) {

            return { [absolutePath]: `File not found : ${error.message}` };

        }

    }))

    res.status(200).json({
        message: "File created successfully",
        data: results
    })

    
    
  
})



// @route   GET  /list-files
// @description Lists all the files and folders in the working directory except node_modules and .env file or dist or .vercel or.git
// @returns {object} as JSON, with the absolute path and success message
// Example: {
//    "message": "Elements in Working dir",
//    "files": [
// "file1.txt",
//  "src/file2.text",
// "src/nested-dir/file3.text",
//    ]
// }




app.get("/list-files", async (req, res) => {

    const ignored = new Set([
        "node_modules",
        ".git",
        ".vercel",
        "dist"
    ]);

    const listFiles = async (dir, baseDir) => {

        const entries = await fs.promises.readdir(dir, {
            withFileTypes: true
        });

        let results = [];

        for (const entry of entries) {

            // Ignore unwanted folders/files
            if (
                ignored.has(entry.name) ||
                entry.name === ".env"
            ) {
                continue;
            }

            const absolutePath = path.join(dir, entry.name);
            const relativePath = path.relative(baseDir, absolutePath);

            // Skip symbolic links
            if (entry.isSymbolicLink()) {
                continue;
            }

            if (entry.isDirectory()) {

                const nestedFiles = await listFiles(
                    absolutePath,
                    baseDir
                );

                results.push(...nestedFiles);

            } else {

                results.push(relativePath);

            }
        }

        return results;
    };

    try {

        // Check workspace exists
        await fs.promises.access(WORKING_DIR);

        const data = await listFiles(
            WORKING_DIR,
            WORKING_DIR
        );

        return res.status(200).json({
            message: "Elements in Working dir",
            files: data,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error listing files",
            error: error.message,
        });

    }

});
export default app;