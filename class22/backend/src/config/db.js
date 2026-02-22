const mongoose = require("mongoose")



async function ConnectDB() {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("MongoDB Connected Successfully");
    
}


module.exports = ConnectDB