import {  UserModel } from "../models/auth.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/email.services.js";

export async function registerController(req,res) {
    

    const {username,email,password} = req.body

    const isUserExists = await UserModel.findOne({
        $or:[{username}, {email}]
    })

    if (isUserExists) {
        return res.status(401).json({
            message:"User is already Registered with This Email or Username",
            success:false,
            err:"User is already Registered"
        })
    }


    const User = await UserModel.create({username,email,password})

    await sendEmail({
        to:email,
        subject:"Welcome to Our WebApp",
        html:`<h1>Welcome to Our WebApp, ${username}!</h1>
        <p>Thank you for registering with us. We're excited to have you on board. If you have any questions or need assistance, feel free to reach out to our support team.</p>
        <p>Best regards,<br>The WebApp Team</p>
        `,

    })

    res.status(201).json({
        message:"User Registered Successfully",
        success:true,
        User:{
            id:User._id,
            username:User.username,
            email:User.email
        }
    })
}





