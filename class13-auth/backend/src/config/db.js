const mongoose = require("mongoose")



const MONGODB = process.env.MONGODB_URI

function ConnectDB(){

     mongoose.connect(MONGODB)
    .then(()=>{
        console.log("MongoDB Connected Successfully"); 
    })
    .catch((err)=>{
        console.log("MongoDb Connection error "+err);
        
    })
   
}


module.exports = ConnectDB