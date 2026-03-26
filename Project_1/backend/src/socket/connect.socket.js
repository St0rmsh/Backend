import {Server} from "socket.io";


let io;

export async function initSocket(httpServer){
    io = new Server(httpServer,{
        cors:{
            origin:"http://localhost:5173",
            methods:["GET","POST"],
            credentials:true
        }
    })

    console.log("Socket.IO server initialized");

    io.on("connection",(socket)=>{
        console.log("User connected",socket.id);
        

        
      // 🎯 JOIN VIDEO ROOM
        socket.on("join-video", (videoId) => {
            socket.join(videoId);
            console.log(`User ${socket.id} joined video ${videoId}`);
        });

        // 🚪 LEAVE (optional but good)
        socket.on("leave-video", (videoId) => {
            socket.leave(videoId);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    })

    
}

export function getIO(){
    if(!io){
        throw new Error("Socket not initialized");
    }
    return io;
}