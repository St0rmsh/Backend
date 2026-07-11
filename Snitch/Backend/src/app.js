import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { config } from './config/config.js';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import path from "path";
import { fileURLToPath } from "url";
import UserModel from './models/user.model.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.join(__dirname, "../public");

app.use(express.static(publicPath));

// Keep all your API routes above this point

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});




// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));

// Rate Limiting
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 1000, // Limit each IP to 1000 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // expose limit/remaining in headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    message: { message: "Too many requests from this IP, please try again after 15 minutes", success: false }
});
app.use('/api/', limiter);

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// CORS — allow the Vite dev server to talk to the API
app.use(cors({
  origin: true,
  credentials: true,         
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

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

// Cart Routes
import cartRouter from './routes/cart.routes.js';
app.use('/api/cart', cartRouter);

// Order Routes
import orderRouter from './routes/order.routes.js';
app.use('/api/order', orderRouter);

// Wishlist Routes
import wishlistRouter from './routes/wishlist.routes.js';
app.use('/api/wishlist', wishlistRouter);

export default app;