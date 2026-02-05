const mongoose = require("mongoose")

const NotesSchema = mongoose.Schema({
    title:String,
    description:String
})


const NotesModel = mongoose.model("notes", NotesSchema)

module.exports = NotesModel