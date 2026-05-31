import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";


export const registerService = async (data) => {

    try {
        const { username, password, email } = data;

    if (!username || !password || !email) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const alreadyExistsUser = await User.findOne({ email });
    if (alreadyExistsUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
         username,
          password, 
          email
         });

    await user.save();

    const accessToken = jwt.sign(
        { id: user._id },
        config.accessToken,
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { id: user._id },
        config.refreshToken,
        { expiresIn: "7d" }
    );

    return {
        user,
        accessToken,
        refreshToken,   
    }

    } catch (error) {

        console.log("Service Error ", err);
        throw new Error(error)
        
        
    }

    
} 


export const loginService = async(data) => {
    

    try {

        const {email, password} = data;

        if(!email || !password){
            return res.status(400).json({message: "All fields are required"})
        }

        const isUserExists = await User.findOne({email});

        if(!isUserExists){
            return res.status(404).json({message: "User not found"})
        }

        const isPasswordValid = isUserExists.comparePassword(password);

        if(!isPasswordValid){
            return res.status(401).json({message: "Invalid password"})
        }

        const accessToken = jwt.sign(
            { id: isUserExists._id },
            config.accessToken,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: isUserExists._id },
            config.refreshToken,
            { expiresIn: "7d" }
        );

        return {
            user: {
                _id: isUserExists._id,
                email: isUserExists.email,
                username: isUserExists.username,
            },
            accessToken,
            refreshToken,
        }
        
    } catch (error) {
        
        console.log("Service Error ", err);
        throw new Error(error)
        
    }

}