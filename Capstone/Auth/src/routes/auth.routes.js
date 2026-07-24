import { Router } from "express";
import userModel from "../models/user.model.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { sendAuthNotification } from "../config/mq.js";

const router = Router();


router.get("/google",passport.authenticate("google", {scope: ["profile", "email"],session:false}));

router.get("/google/callback", passport.authenticate("google", {
    failureRedirect: "/",
    session:false
}), async(req,res)=>{

    try {
        const {id, displayName, emails, photos} = req.user;


        let user = await userModel.findOne({googleId:id});



        if(!user){
            user = await userModel.create({
                googleId:id,
                name:displayName,
                email:emails[0].value,
                image:photos?.[0]?.value || ""
            })

        }

                await sendAuthNotification({
                    userId: user._id,
                    action: "google_login",
                    timestamp: new Date(),
                    emails: emails[0].value
                })



        const token = jwt.sign({id: user._id},process.env.AUTH_JWT_SECRET,{expiresIn: "1d"});


        res.cookie("token", token , {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
            domain: "localhost"
        });

        res.redirect(`http://localhost:5173`)


    } catch (error) {
        console.error("Error in Google Callback:", error);
        res.redirect("/")
    }

})

// New: returns the currently logged-in user's profile, based on the JWT cookie.
// Used by the frontend to identify "you" for presence/collaboration features.
router.get("/me", async (req, res) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const decoded = jwt.verify(token, process.env.AUTH_JWT_SECRET);

        const user = await userModel.findById(decoded.id).select("-googleId");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        return res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            image: user.image
        });

    } catch (error) {
        console.error("Error in /me:", error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
})


export default router;