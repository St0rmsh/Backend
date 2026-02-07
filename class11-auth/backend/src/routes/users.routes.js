const express = require("express")
const usersModel = require("../models/users.model")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")

const authRoutes = express()

const JWT_SECRET = process.env.JWT_SECRET





authRoutes.post("/register", async(req,res)=>{

    const {username,email,password} = req.body

    const isEmailAreadyExists = await usersModel.findOne({email})

    if (isEmailAreadyExists) {
        return res.status(409).json({
            message:"User is Already Registered with this Email"
        })
    }

    const hash = crypto.createHash("md5").update(password).digest("hex")

    const user = await usersModel.create({
        username,
        email,
        password: hash

    })

    const token = jwt.sign({
        id:user._id
    }, JWT_SECRET)

    res.cookie("token", token)

    res.status(201).json({
        message:"User created sucessful",
        user,
        token
    })


})


authRoutes.post("/login", async(req,res)=>{

    const {email,password} = req.body

    const user = await usersModel.findOne({email})

    if (!user) {
        return res.status(409).json({
            message:"Email is not registered "
        })
    }
    const isPasswordValid = user.password === crypto.createHash("md5").update(password).digest("hex")

    if (!isPasswordValid) {
        return res.status(404).json({
            message:"password is Invalid"
        })
    }
    
    const token = jwt.sign({
        id:user._id
    },JWT_SECRET)

    res.cookie("token", token)

    res.status(200).json({
        message:"User loggedIn Successfully",
        user
    })
})










module.exports = authRoutes


// const hash = crypto.createHash("md5").update(password).digest("hex")