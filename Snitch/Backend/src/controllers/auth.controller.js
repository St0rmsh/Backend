import UserModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";


const sendTokenResponse = (user,  res,message) => {
    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
    success: true,
    message,
    token,
    user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        contact: `${user.contact.countryCode} ${user.contact.number}`,
        role: user.role
    }
});
};



export const registerUser = async (req, res) => {
    try {
        const { fullname, email, password, contact, role } = req.body;

        const existingUser = await UserModel.findOne({ 
            $or:[{ email: email },  ...(contact?.number ? [{ "contact.number": contact.number }] : [])]
         });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new UserModel({
            fullname,
            email,
            password,
            contact,
            role
        });

        await user.save();

    sendTokenResponse(user, res, "User registered successfully");

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({  email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        sendTokenResponse(user, res, "User logged in successfully");

    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });

    }
}



export const getMe = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = req.user.id;

        const user = await UserModel
            .findById(userId)
            .select("-password")
            .lean();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
