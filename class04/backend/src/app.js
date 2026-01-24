const express = require("express")

const app = express()

app.use(express.json())

const notes = []


// post /notes / create notes
app.post("/notes",(req,res)=>{

    console.log(req.body);
    notes.push(req.body)
    
    res.send("note saved")
})

// get /notes /see all notes
app.get("/notes",(req,res)=>{
    res.send(notes)
})


// delete /notes / delete notes

app.delete("/notes/:index",(req,res)=>{
    console.log(notes.length);
    
    if (isNaN(req.params.index)) {
        res.send("Invalid Index")
    }

    else if (req.params.index > notes.length -1) {
        res.send("Wrong index")
    }
    else{

    delete notes[req.params.index]

    res.send("deleted")
    }
})


// patch /notes / edit
app.patch("/notes/:index",(req,res)=>{

     if (isNaN(req.params.index)) {
        res.send("Invalid Index")
    }
    else if (req.params.index > notes.length -1) {
        res.send("Wrong index")
    }
    else{
    notes[req.params.index].description = req.body.description

    res.send("note updated")
    }
    
})


module.exports = app