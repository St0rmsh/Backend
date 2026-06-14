import type { NextFunction,Request, Response } from "express";
import jwt from "jsonwebtoken"
import config from "../config/config.js"
import type { JwtPayload } from "../types/Jwt/payload.types.js";
import redisClient from "../config/cache.js";



export const authMiddleware = async (req:Request,res:Response,next:NextFunction)=>{
    
    try {

        const accessToken = req.cookies?.accessToken;


        if(!accessToken){
             return res.status(401).json({
        success: false,
        message: "Unauthorized"
    });
        }

        const isBlacklisted =
            await redisClient.get(`logout:${accessToken}`);

        if (isBlacklisted) {
            throw new Error("Access token expired");
        }

        const decodedToken = jwt.verify(accessToken,config.ACCESS_TOKEN)as JwtPayload;

        req.user = decodedToken;

        next()

        
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error instanceof Error ? error.message : "Unauthorized"
        });
    }
}