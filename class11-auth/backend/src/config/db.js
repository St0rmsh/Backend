const mongoose = require("mongoose")


const MongoDB = process.env.MONGO_URI

function connectDB(){
  try {
      mongoose.connect(MongoDB)
    .then(()=>{
        console.log("MongoDb connected successfully");
        
    })
    .catch((err)=>{
        console.log("MongoDB connection "+err);
        
    })
  } catch (error) {
    console.log(err);
    
  }
}


module.exports = connectDB