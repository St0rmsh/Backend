import { Router } from "express";
import userModel from "../models/user.model.js";
import passport from "passport";

const router = Router();


router.get("/google",passport.authenticate("google", {scope: ["profile", "email"],session:false}));

router.get("/google/callback", passport.authenticate("google", {
    failureRedirect: "/",
    session:false
}), async(req,res)=>{

    try {
        const {id,displayName,email,image} = req.user;

        let user = await userModel.findOne({googleId:id});

        if(!user){
            user = await userModel.create({
                googleId:id,
                name:displayName,
                email:email[0].value,
                image:image[0].value
            })

            await user.save();
        }


        const token = jwt.sign({id: user._id},process.env.AUTH_JWT_SECRET,{expiresIn: "1d"});


        res.cookie("token", token, { httpOnly: true });
        res.redirect("/")


    } catch (error) {
        console.error("Error in Google Callback:", error);
        res.redirect("/")
    }

})


export default router;