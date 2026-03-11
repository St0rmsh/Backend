import app from "./src/app.js";
import dotenv from "dotenv"
import ConnectDB from "./src/config/db.js";



dotenv.config()

const PORT = process.env.PORT||5000

ConnectDB()

app.listen(PORT, ()=>{
    console.log("Server is running on port "+PORT);
    
})