const songModel = require("../models/song.model")
const id3 = require("node-id3")
const storage = require("../services/storage.services")


async function uploadSong(req,res){

    const songBuffer = req.file.buffer
    const {mood} = req.body

    const tags = id3.read(songBuffer)

    const [songFile, posterfile] = await Promise.all([
        storage.uploadFile({
            buffer: songBuffer,
            filename: tags.title + ".mp3",
            folder: "/Moodify/songs"
        }),
        storage.uploadFile({
            buffer: tags.image.imageBuffer,
            filename: tags.title + ".jpeg",
            folder: "/Moodify/posters"
        })
    ])


    const song = await songModel.create({
        title:tags.title,
        url:songFile.url,
        posterUrl:posterfile.url,
        mood
    })

    res.status(201).json({
        message:"Song Uploaded Successfully",
        song
    })


    

}


async function getSongs(req,res){
    
    const {mood} = req.query

    const song = await songModel.findOne({mood:mood})


    res.status(200).json({
        message:"Songs fetched successfully",
        song
    })
}

module.exports = {
    uploadSong,
    getSongs
}