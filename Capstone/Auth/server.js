import app from "./src/app.js";
import ConnectDB from "./src/config/db.js";
import dns from "dns";


const PORT = 3000;

dns.setServers(["8.8.8.8", "1.1.1.1"]);


ConnectDB();

app.listen(PORT, () => {
    console.log(`Auth Server running on port ${PORT}`);
});