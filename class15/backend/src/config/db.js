const mongoose = require("mongoose")



 const MONGODB = process.env.MONGODB_URI
async function ConnectDB(){

      await mongoose.connect(MONGODB)
    .then(()=>{
        console.log("MongoDb connected ");
        
    })
 
}

module.exports = ConnectDB