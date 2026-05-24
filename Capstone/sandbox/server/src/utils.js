import jwt from "jsonwebtoken";


export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.AUTH_JWT_SECRET);
        return decoded;
    } catch (error) {
        console.log(`Failed to verify token`, error);
        return null;
    }
}