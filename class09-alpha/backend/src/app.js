const express = require("express")
const cors = require("cors")
const NotesModel = require("./models/notes.model")


const app = express()

app.use(express.json())
app.use(cors())



// POST
app.post("/api/notes", async(req,res)=>{
    
    const {title, description} = req.body

    const notes = await NotesModel.create({
        title,
        description
    })

    res.status(201).json({
        message:"Notes created"
    })
})


// GET 

app.get("/api/notes", async(req,res)=>{
    
    const notes = await NotesModel.find()

    res.status(200).json({
        message:"Notes Fetched",
        notes
    })
})

// Delete 
app.delete("/api/notes/:id", async(req,res)=>{
    const {id} = req.params

   const notes =  await NotesModel.findByIdAndDelete(id)

   res.status(200).json({
    message:"Note deleted"
   })
})


// Patch
app.patch("/api/notes/:id", async(req,res)=>{

    const {id} = req.params

    const {title,description} = req.body

    await NotesModel.findByIdAndUpdate(id, {title,description})

    res.status(200).json({
        message:"Notes Updated"
    })
})



module.exports = app