const express = require("express")

const app = express()


app.use(express.json())

const notes = []

// POST /notes
app.post("/notes",(req,res)=>{
    notes.push(req.body)
    res.status(201).json({
        message:"Note created"
    })
    
})


// GET /notes
app.get("/notes",(req,res)=>{
    res.status(200).json({
        Note: notes
    })
})


// DELETE /notes/:index
app.delete("/notes/:index",(req,res)=>{
    delete notes[req.params.index]

    res.status(204).json({
        message:"Note deleted"
    })
})


// PATCH /notes/:index

app.patch("/notes/:index",(req,res)=>{
    notes[req.params.index].descritpion = req.body.descritpion

    res.status(200).json({
        message:"Note Updated"
    })
})


module.exports = app