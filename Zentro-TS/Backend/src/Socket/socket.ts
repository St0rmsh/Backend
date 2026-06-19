import {Server} from "socket.io"
import { socketAuth } from "./socketAuth.js";


let io :Server;


export const initailSocketIO = (httpServer:any) =>{
    io = new Server(httpServer , {
        cors : {
            origin:"http://localhost:5173",
            methods:["GET","POST"],
            credentials:true
        }
    })

    io.use(socketAuth);

    return io;
};


export const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO not initialized");
    }
    return io;
};