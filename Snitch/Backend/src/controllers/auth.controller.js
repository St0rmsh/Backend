import UserModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto';


const sendTokenResponse = (user, res, message, redirectUrl = null) => {
    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    if (redirectUrl) {
        return res.redirect(redirectUrl);
    }

    res.status(message === 'User registered successfully' ? 201 : 200).json({
        success: true,
        message,
        token,
        user: {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            contact: user.contact && user.contact.countryCode ? `${user.contact.countryCode} ${user.contact.number}` : null,
            role: user.role
        }
    });
};



export const registerUser = async (req, res) => {
    try {
        const { fullname, email, password, contact, role } = req.body;

        const existingUser = await UserModel.findOne({
            $or: [{ email: email }, ...(contact?.number ? [{ "contact.number": contact.number }] : [])]
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

        const user = await UserModel.findOne({ email });

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



export const googleAuth = async (req, res) => {
    try {
        const user = req.user;
        sendTokenResponse(user, res, "User logged in successfully", "http://localhost:5173");
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const completeProfile = async (req, res) => {
    try {
        const { contact, role, password } = req.body;
        const userId = req.user.id;

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.contact = contact;
        user.role = role || user.role;
        
        if (password) {
            user.password = password;
        }

        await user.save();

        sendTokenResponse(user, res, "Profile completed successfully");
    } catch (error) {
        console.error("Error completing profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found with this email" });
        }

        // Generate a random 10-character password
        const newPassword = crypto.randomBytes(5).toString('hex');

        // Update user's password
        user.password = newPassword;
        await user.save();

        // Professional HTML Email Template
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7; color: #333; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #7c3aed, #4f46e5); padding: 40px 20px; text-align: center; color: white; }
                    .header h1 { margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px; }
                    .content { padding: 40px 30px; line-height: 1.6; }
                    .password-box { background: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0; }
                    .password-text { font-family: monospace; font-size: 24px; font-weight: bold; color: #4f46e5; letter-spacing: 2px; }
                    .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
                    .btn { display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>SNITCH</h1>
                    </div>
                    <div class="content">
                        <h2>Hello ${user.fullname},</h2>
                        <p>We received a request to reset your password. We've generated a new, secure temporary password for your account.</p>
                        
                        <div class="password-box">
                            <p style="margin-top: 0; font-size: 14px; color: #64748b;">Your new password is:</p>
                            <span class="password-text">${newPassword}</span>
                        </div>

                        <p>You can use this password to sign in to your Snitch account immediately. Once logged in, you can keep this password or change it to something else in your profile settings.</p>
                        
                        <a href="http://localhost:5173/login" class="btn">Sign In to Snitch</a>
                        
                        <p style="margin-top: 30px; font-size: 13px; color: #94a3b8;">If you did not request this, please contact our support team immediately.</p>
                    </div>
                    <div class="footer">
                        &copy; 2026 Snitch Fashion. All rights reserved.
                    </div>
                </div>
            </body>
            </html>
        `;

        const message = `Your new Snitch password is: ${newPassword}. Login at http://localhost:5173/login`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Your New Snitch Password',
                message, // Fallback plain text
                html,
            });

            res.status(200).json({ success: true, message: 'New password sent to your email' });
        } catch (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ message: "Email could not be sent" });
        }

    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const resetPassword = async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await UserModel.findOne({
            forgotPasswordToken: resetPasswordToken,
            forgotPasswordExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Set new password
        user.password = req.body.password;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;

        await user.save();

        sendTokenResponse(user, res, "Password reset successfully");

    } catch (error) {
        console.error("Error in resetPassword:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
