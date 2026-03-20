import { generateResponse,generateChatTitle } from "../services/ai.service.js";
import { ChatModel } from "../models/chat.model.js";
import {MessageModel} from "../models/messages.model.js"


export async function sendMessage(req, res) {
  try {
    console.log("REQ BODY:", req.body);

    const { message, chat: chatId } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    let chat = null;
    let title = null;

  if (!chatId) {
  try {
    title = await generateChatTitle(message);
  } catch (err) {
    console.error("Title generation failed:", err.message);
    title = "New Chat"; // ✅ fallback
  }

  chat = await ChatModel.create({
    user: req.user.id,
    title,
  });
}

    const activeChatId = chatId || chat?._id;

    if (!activeChatId) {
      return res.status(400).json({ message: "Invalid chat ID" });
    }

    const userMessage = await MessageModel.create({
      chat: activeChatId,
      content: message,
      role: "user",
    });

    const messages = await MessageModel
      .find({ chat: activeChatId })
      .select("content role createdAt")
      .sort({ createdAt: -1 })
      .limit(15)
      .lean();

    messages.reverse();

    const result = await generateResponse(messages);

    const AIresponse = await MessageModel.create({
      chat: activeChatId,
      content: result,
      role: "assistant",
    });

    res.status(201).json({
      chatId: activeChatId,
      title,
      chat,
      AIresponse,
    });

  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
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

  const chat = await ChatModel.findOneAndDelete({
  _id: chatId,
  user: req.user.id
});

await MessageModel.deleteMany({
  chat: chatId
});

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    res.status(200).json({
        message: "Chat deleted successfully"
    })
}