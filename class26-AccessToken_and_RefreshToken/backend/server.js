import app from "./src/app.js";
import config from "./src/config/config.js";
import connectDB from "./src/config/db.js";
import dns from "dns";

dns.setServers(['8.8.8.8', '8.8.4.4'])


connectDB();


const PORT = config.port || 4000;

app.listen(PORT, (err) => {

    if (err) {
        console.log("Server is not running");
    }

    console.log(`Server is running on port ${PORT}`);
});


