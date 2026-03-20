import app from "./src/app.js";
import dotenv from "dotenv"
import ConnectDB from "./src/config/db.js";
import http from "http"
import { initSocket } from "./src/sockets/server.socket.js";

dotenv.config()

const httpServer = http.createServer(app)


initSocket(httpServer)


const PORT = process.env.PORT||5000

ConnectDB()

httpServer.listen(PORT, ()=>{
    console.log("Server is running on port "+PORT);
    
})