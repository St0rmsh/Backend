import type {Request, Response } from "express";
import type { RegisterBody } from "../types/Auth/user.types.js";
import {registerUserService} from "../services/user.service.js";



export const registrationController = async (  req: Request<{}, {}, RegisterBody>,
    res: Response) => {

    try {

        const {user,accessToken,refreshToken} = await registerUserService(req.body)

        console.log("user",user)

        res.cookie("accessToken", accessToken,{
            httpOnly: true,
            secure: true, 
            sameSite: "strict", 
            maxAge: 15 * 60 * 1000
        } );
        res.cookie("refreshToken", refreshToken,{
            httpOnly: true,
            secure: true, 
            sameSite: "strict", 
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            success:true,
            message:"User registered successfully",
            data:user,
            accessToken,
            refreshToken
        })

        
    } catch (error) {
         console.error("Error in register controller:", error);

        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Registration failed"
        });
        
    }
}