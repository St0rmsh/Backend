import app from "./src/app.js";
import ConnectDB from "./src/config/db.js";

const PORT = 3000;



ConnectDB();

app.listen(PORT, () => {
    console.log(`Auth Server running on port ${PORT}`);
});