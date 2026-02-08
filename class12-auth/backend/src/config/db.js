const mongoose = require("mongoose")


const MONGODB = process.env.MONGODB_URI

function ConnectDB(){
   try {
     mongoose.connect(MONGODB)
    .then(()=>{
        console.log("MongoDB connected successfully");
        
    })
    .catch((err)=>{
        console.log("MongoDB Connection "+err);
        
    })
   } catch (error) {
      console.log("MongoDB connection "+error);
      
   }
}


module.exports = ConnectDB