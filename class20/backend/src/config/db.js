const mongoose = require("mongoose")


async function ConnectDB() {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("MongoDb Connected Successfully");
    
}

module.exports = ConnectDB