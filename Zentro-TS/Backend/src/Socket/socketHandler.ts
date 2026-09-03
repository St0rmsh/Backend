import { Server, Socket } from "socket.io";
import { addUser, removeUser, getSocketId } from "./userSocketMap.js";
import { createMessageService } from "../services/message.service.js";
import { getIO } from "./socket.js";


export const registerSocketHandler = (io:Server)=>{
  
  io.on("connection", (socket) => {

         const userId = socket.data.userId as string;

        if (!userId) {
            socket.disconnect();
            return;
        }

        addUser(userId, socket.id);

                socket.on("message:send", async (payload: { recipientId: string; content: string }) => {
                    try {
                        const message = await createMessageService(userId, payload.recipientId, payload.content);
                        const populated = await message.populate("sender", "username fullname avatar");
                        const recipientSocketId = getSocketId(payload.recipientId);
                        if (recipientSocketId) getIO().to(recipientSocketId).emit("message:new", populated);
                        socket.emit("message:sent", populated);
                    } catch (error) {
                        socket.emit("message:error", { message: error instanceof Error ? error.message : "Unable to send message" });
                    }
                });

                socket.on("typing:start", (recipientId: string) => {
                    const recipientSocketId = getSocketId(recipientId);
                    if (recipientSocketId) socket.to(recipientSocketId).emit("typing:start", userId);
                });

                socket.on("typing:stop", (recipientId: string) => {
                    const recipientSocketId = getSocketId(recipientId);
                    if (recipientSocketId) socket.to(recipientSocketId).emit("typing:stop", userId);
                });

        console.log(`${userId} connected`);

        socket.on("disconnect", () => {

            removeUser(socket.id);

            console.log(`${userId} disconnected`);

        });

    });

}
