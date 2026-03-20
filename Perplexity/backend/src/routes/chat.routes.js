import {Router} from "express"
import { sendMessage,getChats,getMessages,deleteChat,createChat } from "../controller/chat.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const chatRouter = Router()

chatRouter.post("/message",authMiddleware,sendMessage)

chatRouter.get("/", authMiddleware,getChats )

chatRouter.get("/:chatId/messages", authMiddleware,getMessages)

chatRouter.delete("/delete/:chatId", authMiddleware, deleteChat)

chatRouter.post("/",authMiddleware,createChat)

export default chatRouter