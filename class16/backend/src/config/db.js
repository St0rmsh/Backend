const { default: mongoose } = require("mongoose")
const mongosse = require("mongoose")

const MONGODB_URI = process.env.MONGODB_URI

async function ConnectDB(){
      await mongoose.connect(MONGODB_URI)
      console.log("MongoDB connected Successfully");
      
}


module.exports = ConnectDB