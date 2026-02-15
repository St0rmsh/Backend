const mongoose = require("mongoose")



const MONGO_URI = process.env.MONGODB_URI

async function ConnectDB(){
    await mongoose.connect(MONGO_URI)
    console.log("MongoDb is connected Successfully");
    
}



module.exports = ConnectDB