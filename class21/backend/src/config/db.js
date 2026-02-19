const mongoose = require("mongoose");
const app = require("../app");


async function ConnectDB() {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("MongoDb Connected Sucessfully");
    
}



module.exports = ConnectDB