import jwt from "jsonwebtoken";
import config from "../config/config.js";
import userModel from "../models/user.model.js";

export async function authMiddleware(req, res, next) {
    try {
        // Look for token in cookies first, then check the Authorization header
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No token provided",
                success: false,
                err: "No token"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, config.JWT_SECRET);

        // Fetch user from database excluding the password field
        const user = await userModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized - User not found",
                success: false,
                err: "User not found"
            });
        }

        // Attach user object directly to the request object so subsequent controllers can use req.user
        req.user = user;
        
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(401).json({
            message: "Unauthorized - Invalid or expired token",
            success: false,
            err: error.message
        });
    }
}