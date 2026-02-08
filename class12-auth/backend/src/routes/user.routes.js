const express = require("express")
const UserModel = require("../models/user.models")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const authRoutes = express()

const JWT_SECRET = process.env.JWT_SECRET


authRoutes.post("/register", async(req,res)=>{

    const {username,email,password} = req.body

    const isEmailAlreadyRegistered = await UserModel.findOne({email})

    if (isEmailAlreadyRegistered) {
        return res.status(409).json({
            message:"Email is Already Registered"
        })
    }

    const hash = crypto.createHash("md5").update(password).digest("hex")

    const user = await UserModel.create({
        username,
        email,
        password:hash
    })

    const token = jwt.sign({
        id:user._id
    },JWT_SECRET)

    res.cookie("token",token)

    res.status(201).json({
        message:"User registered Successfully",
         user:{
            id:user._id,
            email:user.email
        }
    })
})


authRoutes.post("/login", async(req,res)=>{

    const {email,password} = req.body


     const user = await UserModel.findOne({email})

    if (!user) {
        return res.status(401).json({
            message:"Email is not registered yet"
        })
    }


   const hash = crypto.createHash("md5").update(password).digest("hex")

    const isPasswordValid = user.password === hash


    if (!isPasswordValid) {
        return res.status(401).json({
            message:"Password is Invalid"
        })
    }

    const token = jwt.sign({
        id: user._id
    },JWT_SECRET)

    res.cookie("token", token)

    res.status(200).json({
        messsage:"User logged In Successfully",
        user:{
            id:user._id,
            email:user.email
        }
    })
})


authRoutes.get("/logout", (req,res)=>{

   
    res.clearCookie("token")

    res.status(200).json({
        message:"User logged off successfully"
    })
})












module.exports = authRoutes