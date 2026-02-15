const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const userModel = require("../models/user.model")




const JWT_SECERET = process.env.JWT_SECERET

async function registerController(req,res){

    const {username,email,password,bio,profileImg} = req.body

    const isUserAlreadyExists = await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    })

    if (isUserAlreadyExists) {
        return res.status(409).json({
            message:"User already Registered"
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
    },JWT_SECERET ,{expiresIn:"7d"})

    res.cookie("token", token )

    res.status(201).json({
        message:"User created Successfully",
        user:{
            username:user.username,
            email:user.email,
            bio:user.bio,
            profileImg:user.profileImg
        }
    })
}

async function loginController(req,res){

    const {username,email,password} = req.body

    const user = await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    })


    if (!user) {
        return res.status(401).json({
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
    },JWT_SECERET, {expiresIn:"7d"})

    res.cookie("token", token)

    res.status(200).json({
        message:"user loggedIn Successfully",
        user:{
            username:user.username,
            email:user.email,
            bio:user.bio,
            profileImg:user.profileImg

        }
    })
}









module.exports = {
    registerController,
    loginController
}