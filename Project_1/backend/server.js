import app from "./src/app.js";
import config from "./src/config/config.js";
import ConnectDB from "./src/config/db.js"
import http from "http";
import { initSocket } from "./src/socket/connect.socket.js";


ConnectDB()

const httpServer = http.createServer(app);
initSocket(httpServer);

httpServer.listen(config.PORT,()=>{
    console.log(`Server is running on port ${config.PORT}`);
    
})

