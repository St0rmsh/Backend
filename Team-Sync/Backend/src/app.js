import express from "express";
import morgan from "morgan";


const app = express();

app.use(express.json());
app.use(morgan("dev"));


app.get("/", (req, res) => {
    res.status(200).json("Team Sync is running!");
});




export default app;
