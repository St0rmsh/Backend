import {Server, Socket} from "socket.io"

let io;


export function initSocket(httpServer){
    io = new Server(httpServer,{
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials:true
        }



    })
    console.log("Socket io server is running");
    

    io.on("connection", (Socket)=>{
        console.log("A User Connected "+ Socket.id);
        
    })
}


export function getIO(){
    if (!io) {
        
        throw new Error("Socket.io not initialized")
    }
    return io
}