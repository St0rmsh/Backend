import { Server } from "socket.io";

let io;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  console.log("Socket.IO server initialized");

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // ✅ Join video room
    socket.on("join-video", (videoId) => {
      if (!videoId) return;
      socket.join(videoId);
      console.log(`User ${socket.id} joined video ${videoId}`);
    });

    // ✅ Leave room
    socket.on("leave-video", (videoId) => {
      socket.leave(videoId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

export function getIO() {
  if (!io) throw new Error("Socket not initialized");
  return io;
}
