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

     // 🔥 NEW: CHANNEL ROOM (FOR SUBSCRIBE)
    socket.on("join-channel", (channelId) => {
      if (!channelId) return;
      socket.join(`channel_${channelId}`);
    });

    socket.on("leave-channel", (channelId) => {
      socket.leave(`channel_${channelId}`);
    });

    // VIDEO ROOM
  socket.on("join-video", (videoId) => {
    socket.join(videoId);
  });

  socket.on("leave-video", (videoId) => {
    socket.leave(videoId);
  });

  // ✅ CHANNEL ROOM (ADD THIS)
  socket.on("join-channel", (channelId) => {
    socket.join(channelId);
  });

  socket.on("leave-channel", (channelId) => {
    socket.leave(channelId);
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
