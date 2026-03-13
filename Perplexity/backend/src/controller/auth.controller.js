import {  UserModel } from "../models/auth.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/email.service.js";


const JWT_SECRET = process.env.JWT_SECRET

export async function registerController(req,res) {
    

    const {username,email,password} = req.body

    const isUserExists = await UserModel.findOne({
        $or:[{username}, {email}]
    })

    if (isUserExists) {
        return res.status(409).json({
            message:"User is already Registered with This Email or Username",
            success:false,
            err:"User is already Registered"
        })
    }


    const User = await UserModel.create({username,email,password})

    const EmailVerificationToken = jwt.sign({
        email:User.email
    },JWT_SECRET,{expiresIn:"20m"})

    await sendEmail({
        to:email,
        subject:"Welcome to Our WebApp",
        html:`<h1>Welcome to Our WebApp, ${username}!</h1>
        <p>Thank you for registering with us. We're excited to have you on board. If you have any questions or need assistance, feel free to reach out to our support team.</p>
        <p>To get started, you can log in to your account using the following credentials:</p>
        <a href="http://localhost:3000/api/auth/verify-email?token=${EmailVerificationToken}">Verify Your Email</a>
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



export async function verifyEmailController(req,res) {

    const {token} = req.query

    try {

        const decoded = jwt.verify(token, JWT_SECRET)

        const User = await UserModel.findOne({email:decoded.email})


        const userHtmlContent =`<h1>Email is already verified</h1>
            <p>Your email has already been verified. You can log in to your account and start using our services.</p>
            <a href="http://localhost:3000/api/auth/login">Go to Login</a>
            <p>Thank you for joining us!</p>`

        if(!User){
            return res.status(404).json({
                message:"User not found",
                success:false,
                err:"User not found"
            })
        }

        if (User.verified) {
            return res.send(userHtmlContent)
        }

         User.verified=true

         await User.save()

         const htmlContent = `
            <h1>Email Verified Successfully</h1>
            <p>Your email has been verified successfully. You can now log in to your account and start using our services.</p>
            <a href="http://localhost:3000/api/auth/login">Go to Login</a>
            <p>Thank you for joining us!</p>
            `

         res.send(htmlContent)



    } catch (error){
           console.log("An Error has Occured While Veryfying User "+error);

           res.status(500).json({
               message:"Invalid or Expired Token",
               success:false,
           })
           
    }

   
}






export async function loginController(req,res) {

    const {email , password} = req.body

    const user = await UserModel.findOne({email})

    if (!user) {
        return res.status(404).json({
            message:"Invalid Email or Password",
            success:false,
            err:"User not Found"
        })
    }

    const isPasswordMatched = await user.comparePassword(password)

    if (!isPasswordMatched) {
        return res.status(400).json({
            message:"Invalid Email or Password",
            success:false,
            err:"Incorrect Password"
        })
    }

    if (!user.verified) {
        return res.status(400).json({
            message:"Please verify your email before logging in",
            success:false,
            err:"Email is not Verified"
        })
    }

    const token = jwt.sign({
        id:user._id,
        username:user.username
    }, JWT_SECRET, {expiresIn:"7d"})


    res.cookie("token", token)

    res.status(200).json({
        message:"User Logged in Successfully",
        success:true,
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })


}




export async function getMeController(req,res) {

    const userId = req.user.id

    const user = await UserModel.findById(userId).select("-password")

    if (!user) {
        return res.status(404).json({
            message:"User not found",
            success:false,
            err:"user not found"
        })
    }

    res.status(200).json({
        message:"User fetched successfully",
        success:true,
        user
    })

}


export async function resendVerificationEmailController(req,res) {

    const {email} = req.body

    const user = await UserModel.findOne({email})

    if (!user) {
        return res.status(404).json({
            message:"User not found",
            success:false,
            err:"user not found"
        })
    }

    const htmlContent = `<h1>Email is already verified</h1>
            <p>Your email has already been verified. You can log in to your account and start using our services.</p>
            <a href="http://localhost:3000/login">Go to Login</a>
            <p>Thank you for joining us!</p>`

    if (user.verified) {
        return res.send(htmlContent)
    }


    try {

        const EmailVerificationToken = jwt.sign({
            email:user.email
        },JWT_SECRET,{expiresIn:"20m"})

        

        await sendEmail({
            to:user.email,
            subject:"Resend Email Verification",
            html:`<h1>Welcome to Our WebApp, ${user.username}!</h1>
            <p>Thank you for registering with us. We're excited to have you on board. If you have any questions or need assistance, feel free to reach out to our support team.</p>
            <p>To get started, you can log in to your account using the following credentials:</p>
            <a href="http://localhost:3000/api/auth/verify-email?token=${EmailVerificationToken}">Verify Your Email</a>
            <p>Best regards,<br>The WebApp Team</p>`,

        })

        res.status(200).json({
            message:"Verification Email Resent Successfully",
            success:true,
        })




    } catch (error) {
        return res.status(500).json({
            message:"Error Resending Verification Email",
            success:false,
        })
    }
}
