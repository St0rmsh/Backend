import { verifyToken } from "../utils.js";

export const authenticate = (req, res, next) => {
    const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    req.userId = decoded.userId;
    next();
}