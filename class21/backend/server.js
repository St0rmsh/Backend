require("dotenv").config()
const app = require("./src/app")
const ConnectDB = require("./src/config/db")


ConnectDB()

const PORT = process.env.PORT||5000

app.listen(PORT,()=>{
    console.log("Server is running on port "+PORT);
    
})