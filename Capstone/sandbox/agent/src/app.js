import express from "express";
import morgan from "morgan";
import fs from "fs"


const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const WORKING_DIR = "/workspace"

app.get("/",(req,res)=>{
    res.status(200).json({
        message:"Hello from Sandbox Agent",
        status:200,
    })
})


app.get("/list-files",async(req,res)=>{

    const elements = await fs.promises.readdir(WORKING_DIR);

    res.status(200).json({
        message: "Elements in Working dir",
        elements
    })

})


export default app;