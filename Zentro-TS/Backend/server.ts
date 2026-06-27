import app from "./src/app.js";
import config from "./src/config/config.js";
import dns from "dns"
import ConnectDB from "./src/config/db.js";
import http from "http";
import {initailSocketIO} from "./src/Socket/socket.js"
import { registerSocketHandler } from "./src/Socket/socketHandler.js";


dns.setServers(["8.8.8.8", "8.8.4.4"])

ConnectDB()

const server = http.createServer(app);

const io = initailSocketIO(server);

registerSocketHandler(io);


server.listen(config.PORT,()=>{
    console.log(`Server is Running on Port ${config.PORT}`);
    
})