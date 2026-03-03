const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const blacklistingModel = require("../models/blacklisting.model")
const redis = require("../config/cache")


const JWT_SECRET = process.env.JWT_SECRET



async function registerController(req,res) {
    const {username,email,password} = req.body


    const isAlreadyExists = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if (isAlreadyExists) {
        return res.status(401).json({
            message:"User is Already registered"
        })
    }

    const hash = await bcrypt.hash(password,10)

    const user = await userModel.create({
        username,
        email,
        password:hash
    })

    const token = jwt.sign({
        id:user._id,
        username:user.username
    },JWT_SECRET, {expiresIn:"7d"})
    
    
    res.cookie("token", token)

    return res.status(201).json({
        message:"User Registered Successfully",
        user:{
            username:user.username,
            email:user.email
        }
    })
}



async function loginController(req,res){

    const {username,email,password} = req.body

    const user = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    }).select("+password")


    if (!user) {
        return res.status(409).json({
            message:"User is not Registered"
        })
    }
    const isMatch = await bcrypt.compare(password,user.password)

    if (!isMatch) {
        return res.status(409).json({
            message:"Invalid Credentials"
        })
    }

    const token = jwt.sign({
        id:user._id,
        username:user.username
    }, JWT_SECRET, {expiresIn:"7d"})


    res.cookie("token", token)


    return res.status(200).json({
        message:"User loggedIn Successfully",
        user:{
            username:user.username,
            email:user.email
        }
    })
}

async function GetMe(req,res){

    const id = req.user.id

    const user = await userModel.findById(id)

    return res.status(200).json({
        message:"user fetched Successfully",
        user
    })
}


async function logout(req,res){

    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
         message:"token is required"
        })
    }

    res.clearCookie("token")

   await redis.set(token,Date.now().toString(), "EX", 60*60)

    res.status(200).json({
        message:"logout Successfully"
    })
}

module.exports = {
    registerController,
    loginController,
    GetMe,
    logout
}