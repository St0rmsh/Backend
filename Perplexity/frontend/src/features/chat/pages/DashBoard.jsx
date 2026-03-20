import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { useChat } from '../hook/useChat'
import './Dashboard.css'
import remarkGfm from 'remark-gfm'

const Dashboard = () => {
  const chat = useChat()
  const [chatInput, setChatInput] = useState('')
  const [showSidebar, setShowSidebar] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const messagesEndRef = useRef(null)

  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)

  // 🔥 Auto scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleNewChat = chat.handleNewChat;

  useEffect(() => {
    chat.initializeSocket()
    chat.handleGetChats()
    
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [chats, isTyping])

  const handleSubmitMessage = async (e) => {
    e.preventDefault()
    const trimmed = chatInput.trim()
    if (!trimmed) return

    setIsTyping(true)

    await chat.handleSendMessage({
      message: trimmed,
      chatId: currentChatId,
    })

    setChatInput('')
    setIsTyping(false)
  }

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId)
    setShowSidebar(false)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
   <main className="app">

  {/* Sidebar */}
  <aside className={`sidebar ${showSidebar ? 'open' : ''}`}>
    <h1 className="logo">Chat AI</h1>

      {/* 🔥 NEW CHAT BUTTON */}
  <button className="new-chat-btn"  onClick={handleNewChat}>
    + New Chat
  </button>

    <div className="chat-list">
      {Object.values(chats).map((chat, index) => (
        <button
          key={index}
          onClick={() => openChat(chat.id)}
          className="chat-item"
        >
          {chat.title}
        </button>
      ))}
    </div>
  </aside>

  {/* Overlay */}
  {showSidebar && (
    <div className="overlay" onClick={() => setShowSidebar(false)} />
  )}

  {/* Chat Section */}
  <section className="chat-section">

    {/* Header */}
    <div className="chat-header">
      <button className="menu-btn" onClick={() => setShowSidebar(true)}>
        ☰
      </button>
      <h2>AI Chat</h2>
    </div>

    {/* Messages */}
    <div className="messages">

      {chats[currentChatId]?.messages.map((msg) => (

        <div key={msg.id} className="message-wrapper">

          {msg.role === 'user' ? (
            <div className="message-row user">
              <div className="message user-msg">
                {msg.content}
              </div>
            </div>
          ) : (
            <div className="message-row ai">

              <div className="avatar">AI</div>

              <div className="message ai-msg">
                <ReactMarkdown remarkPlugins={remarkGfm}>{msg.content}</ReactMarkdown>

                <div className="actions">
                  <button onClick={() => copyToClipboard(msg.content)}>Copy</button>
                  <button>Regenerate</button>
                </div>
              </div>

            </div>
          )}

        </div>

      ))}

      {isTyping && (
        <div className="message-row ai">
          <div className="avatar">AI</div>
          <div className="typing">Thinking...</div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>

    {/* Input */}
    <div className="chat-input">
      <form onSubmit={handleSubmitMessage}>
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask anything..."
        />
        <button type="submit">Send</button>
      </form>
    </div>

  </section>
</main>

  )
}

export default Dashboard
