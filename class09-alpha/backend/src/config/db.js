const mongoose = require("mongoose")


const MONGO = process.env.MONGODB_URI

function ConnectDB(){
    mongoose.connect(MONGO)
    .then(()=>{
        console.log("MongoDB connected successfull");   
    })
    .catch((err)=>{
        console.log(`MongoDb connection ${err}`);
        
    })
}


module.exports = ConnectDB