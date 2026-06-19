import { Server, Socket } from "socket.io";
import { addUser, removeUser, getSocketId } from "./userSocketMap.js";


export const registerSocketHandler = (io:Server)=>{
  
  io.on("connection", (socket) => {

         const userId = socket.data.userId as string;

        if (!userId) {
            socket.disconnect();
            return;
        }

        addUser(userId, socket.id);

        console.log(`${userId} connected`);

        socket.on("disconnect", () => {

            removeUser(socket.id);

            console.log(`${userId} disconnected`);

        });

    });

}
