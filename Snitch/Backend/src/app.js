import express from 'express';
import morgan from 'morgan';


const app = express();
app.use(morgan('dev'));

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