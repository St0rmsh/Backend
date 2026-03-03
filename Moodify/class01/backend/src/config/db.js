const mongoose = require("mongoose")




async function ConnectDB() {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB is Connected Successfully");
    
}


module.exports = ConnectDB