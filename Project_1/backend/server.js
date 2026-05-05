import app from "./src/app.js";
import config from "./src/config/config.js";
import ConnectDB from "./src/config/db.js";
import http from "http";
import { initSocket } from "./src/socket/connect.socket.js";
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

ConnectDB();

const httpServer = http.createServer(app);
initSocket(httpServer);

httpServer.listen(config.PORT, () => {
  console.log(`🚀 Server running on port ${config.PORT}`);
});
