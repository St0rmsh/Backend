const mongoose = require("mongoose")

async function ConnectDB() {

    await mongoose.connect(process.env.MONGODB_URI)
    console.log("MongoDb is Connected Successfully");
    
    
}

module.exports = ConnectDB