const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const UserModel = require("../models/user.model")



const JWT_SECRET = process.env.JWT_SECRET 

const registerRoutes = async(req,res)=>{

  try {
     const {username, email,password} = req.body

   const IsEmailAlreadyRegistered = await UserModel.findOne({email})

   if (IsEmailAlreadyRegistered) {
      return res.status(409).json({
        message:"Email is Already Registered"
      })
   }

   const hash = await bcrypt.hash(password,10)
   const user = await UserModel.create({
    username,
    email,
    password:hash
   })

   const token = jwt.sign({
    id:user._id
   }, JWT_SECRET)

   res.cookie("token", token)

   res.status(201).json({
    message:"User created Successfully",
    user,
    token
   })
  } catch (error) {
    res.status(500).json({
        message:"server error",
        error:error.message
    })
  }

   
}



const loginRoutes = async(req,res)=>{

    try {
        const {email,password} = req.body

    const user = await UserModel.findOne({email})

    if (!user) {
        return res.status(401).json({
            message:"Email is not registered yet"
        })
    }
     
    const hash = await bcrypt.compare(password,user.password)


    if (!hash) {
        return res.status(401).json({
            message:"Invalid Password "
        })
    }

    const token = jwt.sign({
        id:user._id
    },JWT_SECRET)

    res.cookie("token", token)

    res.status(200).json({
        message:"User LoggedIn Successfully"
    })
    } catch (error) {
        res.status(500).json({
            message:"Server error",
            error:error.message
        })
    }
}


const logoutRoutes = (req,res)=>{

    res.clearCookie("token")

    res.status(200).json({
        message:"User logout Successfully"
    })
}










module.exports = {
    registerRoutes,
    loginRoutes,
    logoutRoutes
}