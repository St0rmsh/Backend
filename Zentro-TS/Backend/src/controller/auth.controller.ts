import type { Request, Response } from "express";
import type { RegisterBody } from "../types/Auth/user.types.js";
import { changePasswordService, forgotPasswordService, generateAccessTokenService, getMyProfileService, loginUserService, logoutService, registerUserService, resetPasswordService, sendOtpService, updateUserDetailsService, verifyOtpService } from "../services/user.service.js";


// for registration controller
export const registrationController = async (req: Request<{}, {}, RegisterBody>,
    res: Response) => {

    try {

        const { user, accessToken, refreshToken } = await registerUserService(req.body)

        console.log("user", user)

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {user,
                accessToken,
                refreshToken
            }
            
        })


    } catch (error) {
        console.error("Error in register controller:", error);

        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Registration failed"
        });

    }
}

// for login controller

export const loginController = async (req: Request<{}, {}, RegisterBody>,
    res: Response) => {

    try {

        const { user, accessToken, refreshToken } = await loginUserService(req.body)

        console.log("user", user)

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        console.log("user =>", user)


        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: {
                user,
                accessToken,
                refreshToken
            }
        })


    } catch (error) {
        console.error("Error in login controller:", error);

        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "login failed"
        });

    }
}

export const getUser = async (req: Request, res: Response) => {
    try {

        const id = req.user?._id;

        if (!id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const result = await getMyProfileService(id);
        if (!result) {
            throw new Error("User not found")
        }

        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: result.user,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Server error"
        });
    }
}

// for refresh access token controller

export const refreshAccessTokenController = async (req: Request, res: Response) => {
    try {

        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            throw new Error("Unauthorized")
        }

        const accessToken = await generateAccessTokenService(refreshToken);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
            data: { accessToken },
        })

    } catch (error) {
        console.error("Error in refresh access token controller:", error);

        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "refresh access token failed"
        });
    }
}


// for logout controller

export const logoutController = async (req: Request, res: Response) => {
    try {

        const refreshToken = req.cookies?.refreshToken;
        const accessToken = req.cookies?.accessToken;

        if (!refreshToken || !accessToken) {
            throw new Error("Unauthorized")
        }

        await logoutService(refreshToken, accessToken);

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");


        res.status(200).json({
            success: true,
            message: "User logged out successfully",
        })


    } catch (error) {
        console.error("Error in logout controller:", error);

        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "logout failed"
        });
    }
}


// for update user controller

export const updateUserController = async (req: Request, res: Response) => {
    try {

        const id = req.user?._id;

        if (!id) {
            throw new Error("Unauthorized")
        }

        const files = req.files as {
            avatar?: Express.Multer.File[];
            banner?: Express.Multer.File[];
        };



        const updatedUser = await updateUserDetailsService(id, req.body, files)

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        })



    } catch (error) {
        console.error("Error in update user controller:", error);

        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "update user failed"
        });
    }
}

// for send otp controller 

export const sendOtpController = async (req: Request, res: Response) => {
    try {
        console.log("req.user =>", req.user);


        const email = req.user?.email;

        if (!email) {
            throw new Error("Unauthorized");
        }

        const result = await sendOtpService(email);

        return res.status(200).json(result);

    } catch (error) {
        console.error("Error in verify email controller:", error);

        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "verify email failed"
        });
    }
}


// for verify email controller 


export const verifyOtpController = async (
    req: Request,
    res: Response
) => {

    try {

        const email = req.user?.email;

        const { otp } = req.body;

        if (!email) {
            throw new Error("Unauthorized");
        }

        const result = await verifyOtpService(
            email,
            otp
        );

        return res.status(200).json(result);

    } catch (error) {

        return res.status(400).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Verification failed"
        });
    }
};


// for change password controller 

export const changePasswordController = async (req: Request, res: Response) => {
    try {

        const email = req.user?.email;

        const { oldPassword, newPassword } = req.body;

        if (!email) {
            throw new Error("Unauthorized")
        }

        const result = await changePasswordService(email, oldPassword, newPassword);

        return res.status(200).json(result);

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "change password failed"
        });
    }
}




// for forget password controller

export const forgotPasswordController = async (req: Request, res: Response) => {
    try {

        const email = req.body?.email;

        if (!email) {
            throw new Error("Email is required")
        }

        const result = await forgotPasswordService(email);

        return res.status(200).json(result);

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "forget password failed"
        });
    }
}


// for Reset Password controller

export const resetPasswordController = async (req: Request, res: Response) => {
    try {

        const { email, newPassword, otp } = req.body;

        if (!email || !newPassword || !otp) {
            throw new Error("All fields are required")
        }

        const result = await resetPasswordService(email, newPassword, otp);

        console.log("result", result);

        return res.status(200).json(result);

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "reset password failed"
        });
    }
}