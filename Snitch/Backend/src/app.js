import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';


const app = express();
app.use(morgan('dev'));
app.use(cookieParser());


// Middleware
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Welcome to the Snitch API!');
});


// Routes

// auth routes
import authRouter from './routes/auth.routes.js';
app.use('/api/auth', authRouter);

export default app;