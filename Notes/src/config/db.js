const mongoose = require("mongoose")

const MONGO = process.env.MONGODB_URI

function ConnectDB(){
    mongoose.connect(MONGO)
    .then(()=>{
        console.log("MongoDB Connected");
        
    })
    .catch((err)=>{
        console.log("MongoDB connection "+ err);
        
    })
}

module.exports = ConnectDB