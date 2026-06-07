import type {Request, Response } from "express";
import type { RegisterBody } from "../types/Auth/user.types.js";
import {genearteAccessTokenService, getMyProfileService, loginUserService, logoutService, registerUserService} from "../services/user.service.js";



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


export const loginController = async (  req: Request<{}, {}, RegisterBody>,
    res: Response) => {

    try {

        const {user,accessToken,refreshToken} = await loginUserService(req.body)

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

        res.status(200).json({
            success:true,
            message:"User logged in successfully",
            data:user,
            accessToken,
            refreshToken
        })

        
    } catch (error) {
         console.error("Error in login controller:", error);

        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "login failed"
        });
        
    }
}

export const getUser = async (req:Request,res:Response)=>{
    try {

        const id = req.user?._id ;

        if (!id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }
        
        const user = await getMyProfileService(id);
        if(!user){
            throw new Error("User not found")
        }

        res.status(200).json({
            success:true,
            message:"User fetched successfully",
            data:user,
        })

    } catch (error) {
         return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Server error"
        });
    }
}


export const refreshAccessTokenController = async (req:Request,res:Response) =>{
    try {
        
        const refreshToken = req.cookies?.refreshToken;

        if(!refreshToken){
            throw new Error("Unauthorized")
        }

        const accessToken = await genearteAccessTokenService(refreshToken);

        res.cookie("accessToken", accessToken,{
            httpOnly: true,
            secure: true, 
            sameSite: "strict", 
            maxAge: 15 * 60 * 1000
        } );

        res.status(200).json({
            success:true,
            message:"Access token refreshed successfully",
            data:accessToken,
        })

    } catch (error) {
        console.error("Error in refresh access token controller:", error);

        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "refresh access token failed"
        });
    }
}

export const logoutController = async (req:Request,res:Response) =>{
    try {

        const refreshToken = req.cookies?.refreshToken;
        const accessToken = req.cookies?.accessToken;

        if(!refreshToken || !accessToken){
            throw new Error("Unauthorized")
        }

         await logoutService(refreshToken,accessToken);

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        

        res.status(200).json({
            success:true,
            message:"User logged out successfully",
        })
        
        
    } catch (error) {
        console.error("Error in logout controller:", error);

        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "logout failed"
        });
    }
}