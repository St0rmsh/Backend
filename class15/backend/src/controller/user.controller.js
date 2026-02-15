const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")


const JWT_SECRET = process.env.JWT_SECRET

async function registerController(req,res){
     
   try {
     const {username,email,password,bio,profileImg} = req.body

    const isUserAlreadyExists = await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    })

    if (isUserAlreadyExists) {
        return res.status(409).json({
            message:"User already exists"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash ,
        bio,
        profileImg
    })

    const token = jwt.sign({
        id:user._id
    },JWT_SECRET , {expiresIn:"7d"})

    res.cookie("token", token)

    res.status(201).json({
        message:"User created",
        user:{
            username:user.username,
            email:user.email,
            bio:user.bio,
            profileImg:user.profileImg
        }
    })
   } catch (error) {
     return res.status(500).json({
        message:"User creation Failed",
        error: "Internal server error"
     })
   }
}


async function loginController(req,res){

  try {
      const {username, email,password} = req.body

    const isUserAlreadyExists = await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    })

    if (!isUserAlreadyExists) {
        return res.status(401).json({
            message:"Username or Email is not Registered "
        })
    }


    const isMatch = await bcrypt.compare(password, isUserAlreadyExists.password)

    if (!isMatch) {
        return res.status(401).json({
            message:"Invalid Password"
        })
    }

    const token = jwt.sign({
        id:isUserAlreadyExists._id
    },JWT_SECRET, {expiresIn:"7d"})

    res.cookie("token", token)

    res.status(200).json({
        message:"user loggedIn Successfully",
        user:{
            username:isUserAlreadyExists.username,
            email:isUserAlreadyExists.email,
            bio:isUserAlreadyExists.bio,
            profileImg:isUserAlreadyExists.profileImg
        },
        token
    })
  } catch (error) {
    return res.status(500).json({
        message:"User login Failed",
        error:"Internal server error"
    })
  }

}

function logoutController(req,res){
    res.clearCookie("token")

    res.status(200).json({
        message:"User logged out Successfully"
    })
}




module.exports = {
    registerController,
    loginController,
    logoutController
}
