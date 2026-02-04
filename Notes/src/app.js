const express = require("express")
const cors = require("cors")
const NotesModel = require("./models/Notes.model")

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static("./public"))


// API

 // POST API Create notes
 
    app.post("/api/notes", async(req,res)=>{
    const {title , description} = req.body

    const Notes = await NotesModel.create({
        title,
        description
    })

    res.status(201).json({
        message:"Notes created successfully"
    })
   })


  // GET API / View notes
   
      app.get("/api/notes", async(req,res)=>{

    const Notes = await NotesModel.find()

    res.status(200).json({
        message:"Notes Fetched",
        Notes
    })
    })


  // DELETE Api / delete notes 

  app.delete("/api/notes/:id", async(req,res)=>{
    const {id} = req.params

    await NotesModel.findByIdAndDelete(id)

    res.status(200).json({
        message:"Notes deleted"
    })
  })

  // Update Api / Update note
  
  app.patch("/api/notes/:id", async(req,res)=>{
    const {id} = req.params
    const {title,description} = req.body
    await NotesModel.findByIdAndUpdate(id, {title,description})

    res.status(200).json({
        message:"Note Updated successful"
    })
  })






module.exports = app