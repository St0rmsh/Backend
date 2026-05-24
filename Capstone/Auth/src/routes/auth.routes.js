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


        res.cookie("token", token);

        res.redirect("http://localhost:5173")


    } catch (error) {
        console.error("Error in Google Callback:", error);
        res.redirect("/")
    }

})


export default router;