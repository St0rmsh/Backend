import express from "express";
import morgan from "morgan";
import cors from "cors";
import fs from "fs"
import path from "path"
import http from "http";
import {Server} from "socket.io";
import pty from "node-pty"


const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({limit:"50mb" , extended: false}));

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const WORKING_DIR = "/workspace"

app.get("/",(req,res)=>{
    res.status(200).json({
        message:"Hello from Sandbox Agent",
        status:200,
    })
})

const shell = process.env.SHELL || "bash"

const ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: "/workspace",
  env: process.env
});

const MAX_BUFFER_SIZE = 500_000;
let terminalBuffer = "";

ptyProcess.onData((data) => {
  terminalBuffer += data;
  if (terminalBuffer.length > MAX_BUFFER_SIZE) {
    terminalBuffer = terminalBuffer.slice(terminalBuffer.length - MAX_BUFFER_SIZE);
  }
  io.emit("terminal-output", data);
});

ptyProcess.onExit(({exitCode, signal}) => {
    console.log(`Terminal exited with code ${exitCode} and signal ${signal}`);
})

// Presence tracking — one pod = one sandbox, so a simple in-memory map
// of connected sockets to user identity is all we need (no rooms required).
const connectedUsers = new Map(); // socket.id -> { id, name, image, socketId }

function broadcastPresence() {
    const users = Array.from(connectedUsers.values());
    io.emit("presence-update", users);
}

io.on("connection",(socket)=>{
    console.log(`User connected: ${socket.id}`);

    // Identity is passed explicitly in the handshake, since *.agent.localhost
    // is a different origin than the auth cookie's domain and won't receive it.
    const userAuth = socket.handshake.auth || {};
    const user = {
        socketId: socket.id,
        id: userAuth.id || null,
        name: userAuth.name || "Guest",
        image: userAuth.image || null
    };
    connectedUsers.set(socket.id, user);
    broadcastPresence();

    if (terminalBuffer.length > 0) {
        socket.emit("terminal-output", terminalBuffer);
    }

    socket.on("terminal-input",(data)=>{
        ptyProcess.write(data)
    })

    socket.on("disconnect",()=>{
        console.log(`User disconnected: ${socket.id}`);
        connectedUsers.delete(socket.id);
        broadcastPresence();
    })
})

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

app.patch("/update-file", async (req, res) => {

    try {

        const updates = req.body.updates;

        if (!updates || !Array.isArray(updates)) {
            return res.status(400).json({
                message: "Updates must be an array"
            });
        }

        const result = await Promise.all(

            updates.map(async (update) => {

                const {
                    filePath,
                    content
                } = update;

                const safePath =
                    filePath.replace(/^\/+/, "");

                const absolutePath =
                    path.resolve(
                        WORKING_DIR,
                        safePath
                    );

                if (
                    !absolutePath.startsWith(
                        WORKING_DIR
                    )
                ) {
                    throw new Error(
                        "Access denied"
                    );
                }

                let oldContent = "";
                try {
                    oldContent = await fs.promises.readFile(absolutePath, "utf-8");
                } catch (readErr) {
                    oldContent = "";
                }

                await fs.promises.mkdir(
                    path.dirname(absolutePath),
                    { recursive: true }
                );

                await fs.promises.writeFile(
                    absolutePath,
                    content,
                    "utf-8"
                );

                return {
                    filePath: safePath,
                    message: "File updated successfully",
                    oldContent,
                    newContent: content
                };

            })

        );

        return res.status(200).json({
            message: "File updated successfully",
            data: result
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: error.message
        });

    }

});

app.delete("/delete-file", async (req, res) => {
    const { filePath } = req.body;

    if (!filePath) {
        return res.status(400).json({
            message: "filePath is required",
            status: 400,
        });
    }

    const safePath = filePath.replace(/^\/+/, "");
    const absolutePath = path.resolve(WORKING_DIR, safePath);

    if (!absolutePath.startsWith(WORKING_DIR)) {
        return res.status(403).json({ message: "Access denied" });
    }

    try {
        const stat = await fs.promises.stat(absolutePath);

        if (stat.isDirectory()) {
            await fs.promises.rm(absolutePath, { recursive: true, force: true });
        } else {
            await fs.promises.unlink(absolutePath);
        }

        return res.status(200).json({
            message: "Deleted successfully",
            data: { [safePath]: "deleted" }
        });
    } catch (error) {
        return res.status(500).json({
            message: `Failed to delete: ${error.message}`
        });
    }
});

app.patch("/rename-file", async (req, res) => {
    const { oldPath, newPath } = req.body;

    if (!oldPath || !newPath) {
        return res.status(400).json({
            message: "oldPath and newPath are required",
            status: 400,
        });
    }

    const safeOldPath = oldPath.replace(/^\/+/, "");
    const safeNewPath = newPath.replace(/^\/+/, "");

    const absoluteOldPath = path.resolve(WORKING_DIR, safeOldPath);
    const absoluteNewPath = path.resolve(WORKING_DIR, safeNewPath);

    if (!absoluteOldPath.startsWith(WORKING_DIR) || !absoluteNewPath.startsWith(WORKING_DIR)) {
        return res.status(403).json({ message: "Access denied" });
    }

    try {
        await fs.promises.mkdir(path.dirname(absoluteNewPath), { recursive: true });
        await fs.promises.rename(absoluteOldPath, absoluteNewPath);

        return res.status(200).json({
            message: "Renamed successfully",
            data: { [safeOldPath]: safeNewPath }
        });
    } catch (error) {
        return res.status(500).json({
            message: `Failed to rename: ${error.message}`
        });
    }
});

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

            if (
                ignored.has(entry.name) ||
                entry.name === ".env"
            ) {
                continue;
            }

            const absolutePath = path.join(dir, entry.name);
            const relativePath = path.relative(baseDir, absolutePath);

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

export default httpServer;