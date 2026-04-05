import express from 'express';
import runGraph from "./ai/graph.ai.js"
import { success } from 'zod';
import cors from 'cors';

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json())

app.get('/', async (req, res) => {

    const problem = "write function to calculate factorial of a number in javascript";

    const result = await runGraph(problem);
    res.json(result);
});


app.post('/chat', async (req, res) => {

    const { message } = req.body;
    const result = await runGraph(message);
    res.status(200).json({
        message:"Result from graph",
        success:true,
        data:result
    });
});


export default app