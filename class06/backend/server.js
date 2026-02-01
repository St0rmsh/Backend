const app = require("./src/app")
const mongoose = require("mongoose")

const PORT=4000

function connectDB(){
   mongoose.connect("mongodb+srv://sujitku5619_db_user:vJbq0oi6mgEuPp7o@cluster0.nqz9czj.mongodb.net/?appName=Cluster0/notes")
   .then(()=>{
      console.log("MongoDB is connected");
      
   })
   .catch((err)=>{
      console.log("MongoDB connection error "+ err);
      
   })
}

connectDB()



app.listen(PORT,()=>{
   console.log("Server is running on port "+ PORT);
   
})