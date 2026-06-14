import type { Request, Response } from "express";
import { getprofileService } from "../services/user.service.js";



export const getUserProfileController = async (req:Request<{userId:string}>,res:Response)=>{
    try {
        const {userId} = req.params;
       
        const stats = await getprofileService(userId);

       return res.status(200).json({
        success:true,
        data: stats
       });
    } catch (error) {
        if(error instanceof Error){
            return res.status(500).json({message:error.message});
        }
        return res.status(500).json({message:"Internal server error"});
    }
}
