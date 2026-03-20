import { initializeSocket } from "../service/chat.socket";
import { sendMessages, fetchChats,fetchMessage} from "../service/chat.api";
import { setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage, addMessages } from "../chat.slice";
import { useDispatch } from "react-redux";


export const useChat = () => {

    const dispatch = useDispatch()


    async function handleSendMessage({ message, chatId }) {
        dispatch(setLoading(true))
        const data = await sendMessages({ message, chatId })
        const { chat, AIresponse } = data
        dispatch(createNewChat({
            chatId: chat._id,
            title: chat.title,
        }))
        dispatch(addNewMessage({
            chatId: chat._id,
            content: message,
            role: "user",
        }))
        dispatch(addNewMessage({
            chatId: chat._id,
            content: AIresponse.content,
            role: AIresponse.role,
        }))
        dispatch(setCurrentChatId(chat._id))
    }

    async function handleGetChats() {
        dispatch(setLoading(true))
        const data = await fetchChats()
        const { chats } = data
        dispatch(setChats(chats.reduce((acc, chat) => {
            acc[ chat._id ] = {
                id: chat._id,
                title: chat.title,
                messages: [],
                lastUpdated: chat.updatedAt,
            }
            return acc
        }, {})))
        dispatch(setLoading(false))
    }

    async function handleOpenChat(chatId) {

        const data = await fetchMessage(chatId)
        const { messages } = data

        const formattedMessages = messages.map(msg => ({
            content: msg.content,
            role: msg.role,
        }))
        dispatch(addMessages({
            chatId,
            messages: formattedMessages,
        }))
        dispatch(setCurrentChatId(chatId))
    }

    return {
        initializeSocket,
        handleSendMessage,
        handleGetChats,
        handleOpenChat
    }

}