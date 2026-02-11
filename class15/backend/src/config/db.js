const mongoose = require("mongoose")



const MONGODB = process.env.MONGODB_URI
function ConnectDB(){
    mongoose.connect(MONGODB)
    .then(()=>{
        console.log("MongoDb connected ");
        
    })
    .catch((err)=>{
        console.log("MongoDB Connection error "+err);
        
    })
}

module.exports = ConnectDB