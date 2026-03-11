import express from 'express';
import { HandleError } from './middleware/errorHandler.middleware.js';
const app = express()




// Routes 
import AuthRouter from './routes/auth.routes.js';
app.use(express.json())
app.use("/api/auth",AuthRouter)




app.use(HandleError)


export default app