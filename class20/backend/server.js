require("dotenv").config()
const app = require("./src/app")
const ConnectDB = require("./src/config/db")


const PORT = process.env.PORT

ConnectDB()


app.listen(PORT,()=>{
    console.log("Server is running on port "+PORT);
    
})