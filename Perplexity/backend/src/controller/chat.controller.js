import { generateResponse,generateChatTitle } from "../services/ai.service.js";
import { ChatModel } from "../models/chat.model.js";
import {MessageModel} from "../models/messages.model.js"


export async function sendMessage(req,res) {

    const {message, chat: chatId} = req.body


    let chat = null 
    let title = null

    if (!chatId) {

        title = await generateChatTitle(message)

        chat = await ChatModel.create({
        user: req.user.id,
        title,

    })
    }

    const activeChatId = chatId || chat._id


    const userMessage = await MessageModel.create({
        chat: activeChatId,
        content:message,
        role:"user"
    })

    const messages = await MessageModel.find({chat:activeChatId})


    const result = await generateResponse(messages);

    const AIresponse = await MessageModel.create({
        chat:activeChatId,
        content:result,
        role:"ai"
    }) 

    res.status(201).json({
        chatId:activeChatId,
        title,
        chat,
        AIresponse
    })
    


}


export async function getChats(req,res) {

    const user = req.user

    const chats = await ChatModel.find({user:user.id})

    return res.status(200).json({
        message:"Chats fetched successfully",
        chats
    })
}


export async function getMessages(req,res) {

    const {chatId} = req.params

    const chat = await ChatModel.findOne({_id:chatId,
        user:req.user.id })


        if (!chat) {
            return res.status(404).json({
                message:"Chat not found"
            })
        }

        const messages = await MessageModel.find({chat:chatId})

        res.status(200).json({
            message:"Messages fetched successfully",
            messages
        })
}



export async function deleteChat(req, res) {

     const { chatId } = req.params;

    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user: req.user.id
    })

    await messageModel.deleteMany({
        chat: chatId
    })

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    res.status(200).json({
        message: "Chat deleted successfully"
    })
}