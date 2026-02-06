const mongoose = require("mongoose")

const MongoDb = process.env.MONGODB_URI

function ConnectDB(){
    try {
        mongoose.connect(MongoDb)
        .then(()=>{
            console.log("MongoDb connected");
            
        })
        .catch((err)=>{
            console.log("MongoDb connection "+err);
            
        })
    } catch (error) {
        console.log(error);
        
    }
}


module.exports = ConnectDB