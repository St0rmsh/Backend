import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";
import UserModel from '../models/user.model.js';

export const authMiddleware = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({
            message: "No token provided, authorization denied"
        });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token, authorization denied"
        });
    }
};


export const authSeller = async(req,res,next) => {
    
    const token = req.cookies?.token;

    if(!token){
        return res.status(401).json({
            message: "No token provided, authorization denied"
        });
    }
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await UserModel.findById(decoded.id);

        if(!user){
            return res.status(401).json({
                message: "User not found"
            });
        }
        if(user.role !== 'seller'){
            return res.status(403).json({
                message: "Forbidden"
            });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token, authorization denied"
        });
    }
}