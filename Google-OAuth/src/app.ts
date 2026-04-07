import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import config from './config/config.js';
import morgan from "morgan"


const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use(passport.initialize());

passport.use(new GoogleStrategy({
  clientID: config.googleClientId,
  clientSecret: config.googleClientSecret,
  callbackURL: "/auth/google/callback"
},(_,__,profile,done)=>{
    return done(null, profile);
}));




app.get('/auth/google',(req,res)=>{
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
})


app.get('/auth/google/callback', 
    passport.authenticate('google', 
        { session: false,failureRedirect: '/' }),
   (req, res) => {
    console.log(req.user);
    
    res.send('Google authentication successful!');
});

export default app;