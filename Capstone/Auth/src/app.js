import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as  GoogleStrategy } from "passport-google-oauth20";
import cookieParser from "cookie-parser";
import router from "./routes/auth.routes.js";


const app = express();



app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

app.get("/_status/healthz",(req,res)=>{
    res.status(200).json({
        message:"OK"
    });
})

app.get("/_status/readyz",(req,res)=>{
    res.status(200).json({
        message:"OK"
    });
})

app.use("/api/auth",router)




export default app;