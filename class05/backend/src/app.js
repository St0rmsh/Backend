const express = require("express")

const app = express()

app.use(express.json())

let note = []


// Post
app.post("/notes",(req,res)=>{
    console.log(req.body);
    note.push(req.body)
    res.status(201).json({
        message:"Note Created Successfully"
    })
})


// get / notes 
app.get("/notes",(req,res)=>{
    res.status(200).json({
        Note: note
    })
})


// delete 

app.delete("/notes/:index",(req,res)=>{

    if (req.params.index > note.length-1 || isNaN(req.params.index)) {
        res.send("Invalid Index")
    }
    delete note[req.params.index]
    res.status(204).json({
        message:"Note deleted successfully"
    })

})

app.patch("/notes/:index",(req,res)=>{
    note[req.params.index].description = req.body.description

    res.status(200).json({
        message:"Note Updated successfully"
    })
})

module.exports = app

