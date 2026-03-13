import app from "./src/app.js";
import dotenv from "dotenv"
import ConnectDB from "./src/config/db.js";
import { TestAi } from "./src/services/ai.service.js";


dotenv.config()

TestAi()

const PORT = process.env.PORT||5000

ConnectDB()

app.listen(PORT, ()=>{
    console.log("Server is running on port "+PORT);
    
})