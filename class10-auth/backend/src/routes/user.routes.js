const express = require("express")
const jwt = require("jsonwebtoken")
const userModel = require("../models/user.models")

const authRoutes = express()

const jwt_secret = process.env.JWT_SECRET


authRoutes.post("/register", async(req,res)=>{
    const {username,email,password} = req.body

    const isEmailAlreadyExists = await userModel.findOne({email})

    if (isEmailAlreadyExists) {
        return res.status(409).json({
            message:"Email is Already Registered"
        })
    }

    const user = await userModel.create({
        username,
        email,
        password
    })

    const token = jwt.sign({
        id: user._id,
        email: user.email
    }, jwt_secret) 

    res.cookie("jwt_token", token)

    res.status(201).json({
        message:"user created successfully",
        user,
        token
    } )
})












module.exports = authRoutes