import {registerService, loginService} from "../services/auth.service.js"


export const registerUser = async (req, res) => {

 try {
    const {user, accessToken, refreshToken} = await registerService(req.body)

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
    });


    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    return res.status(201).json({
        message: "User registered successfully",
        accessToken,
        refreshToken,
        user,
    });

} catch (error) {

    return res.status(500).json({
        message: "Internal server error",
        error: error.message,
    });    

 }

}


export const loginUser = async (req, res) => {

 try {

    const {user, accessToken, refreshToken} = await loginService(req.body);
    
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
    });


    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    return res.status(201).json({
        message: "User logged in successfully",
        accessToken,
        refreshToken,
        user,
    });

    
 } catch (error) {
    
    return res.status(500).json({
        message: "Internal server error",
        error: error.message,
    });    

 }   

}