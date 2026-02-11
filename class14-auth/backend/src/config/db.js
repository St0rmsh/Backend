const mongoose = require('mongoose')


const MONGODB = process.env.MONGODB_URI

async function ConnectDB(){
  try {
     await mongoose.connect(MONGODB)
    .then(()=>{
        console.log("MongoDB connected Successfully");
        
    })
  } catch (error) {
    console.log("MongoDB Connection error "+error);
    process.exit(1)
    
  }
}


module.exports = ConnectDB