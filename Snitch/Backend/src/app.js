import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from './config/config.js';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import UserModel from './models/user.model.js';

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// // CORS — allow the Vite dev server to talk to the API
// app.use(cors({
//   origin: ['http://localhost:5173'],
//   credentials: true,          // needed for cookies (JWT)
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));

app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_SECRET,
    callbackURL: '/api/auth/google/callback',
    scope: ['profile', 'email'],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await UserModel.findOne({ googleId: profile.id });
        
        if (!user) {
            user = await UserModel.findOne({ email: profile.emails[0].value });
            if (user) {
                user.googleId = profile.id;
                await user.save();
            } else {
                user = await UserModel.create({
                    googleId: profile.id,
                    fullname: profile.displayName,
                    email: profile.emails[0].value,
                    role: 'buyer' 
                });
            }
        }
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));




app.get('/', (req, res) => {
    res.send('Welcome to the Snitch API!');
});



// Routes

   // Auth Routes    
   import authRouter from './routes/auth.routes.js';
   app.use('/api/auth', authRouter);


   // Product Routes
   import productRouter from './routes/product.routes.js';
   app.use('/api/product', productRouter);


export default app;