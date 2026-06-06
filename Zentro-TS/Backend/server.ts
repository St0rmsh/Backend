import app from "./src/app.js";
import config from "./src/config/config.js";
import dns from "dns"
import ConnectDB from "./src/config/db.js";

dns.setServers(["8.8.8.8", "8.8.4.4"])

ConnectDB()

app.listen(config.PORT,()=>{
    console.log(`Server is Running on Port ${config.PORT}`);
    
})