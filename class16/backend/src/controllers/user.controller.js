const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")



const JWT_SECRET = process.env.JWT_SECRET

async function registerController(req,res){

   try {
     const {username,email,password,bio,profileImg} = req.body

    const isUserExists = await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    })

    if (isUserExists) {
        return res.status(409).json({
            message:"User is already registered"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash,
        bio,
        profileImg

    })

    const token = jwt.sign({
        id:user._id
    },JWT_SECRET , {expiresIn:"7d"})

    res.cookie("token", token)

    res.status(201).json({
        message:"User created Successfully",
        user:{
            username:user.username,
            email:user.email,
            bio:user.bio,
            profileImg:user.profileImg
        },
    })
   } catch (error) {
     res.status(500).json({
        message:"server error",
        error
     })
   }

}



async function loginController(req,res){

   try {
     const {username,email,password} = req.body

    const user = await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    })

    if (!user) {
        return res.status(409).json({
            message:"User is not registered "
        })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        return res.status(401).json({
            message:"Incorrect Credentials"
        })
    }

    const token = jwt.sign({
        id:user._id
    },JWT_SECRET, {expiresIn:"7d"})

    res.cookie("token", token)

    res.status(200).json({
        message:'User LoggedIn Successfully',
        user:{
            username:user.username,
            email:user.email,
            bio:user.bio,
            profileImg:user.profileImg
        }
    })
   } catch (error) {
     res.status(500).json({
        message:"server error",
        error
     })
   }
}





module.exports = {
    registerController,
    loginController
}