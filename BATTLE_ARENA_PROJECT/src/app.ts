import express from 'express';
import runGraph from "./ai/graph.ai.js"


const app = express();


app.get('/', async (req, res) => {

    const problem = "write function to calculate factorial of a number in javascript";

    const result = await runGraph(problem);
    res.json(result);
});



export default app