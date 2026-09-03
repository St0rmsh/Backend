import { FormEvent, useEffect, useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { useAppSelector } from "@/shared/hooks";
import { socketService } from "@/shared/lib/socket";
import { messageService, Message } from "../services/message.service";
import { useSearchParams } from "react-router-dom";

export function MessagesPage() {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [searchParams] = useSearchParams();
  const [recipientId, setRecipientId] = useState(() => searchParams.get("recipient") || "");
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (!recipientId) return;
    messageService.getConversation(recipientId).then(setMessages).catch(() => setMessages([]));
    void messageService.markRead(recipientId);
    const handleMessage = (message: unknown) => {
      const next = message as Message;
      const senderId = typeof next.sender === "string" ? next.sender : next.sender?._id;
      if (senderId === recipientId || next.recipient === recipientId) setMessages((current) => [...current, next]);
    };
    const handleTyping = (userId: unknown) => { if (userId === recipientId) setTyping(true); };
    const handleTypingStop = (userId: unknown) => { if (userId === recipientId) setTyping(false); };
    socketService.on("message:new", handleMessage);
    socketService.on("typing:start", handleTyping);
    socketService.on("typing:stop", handleTypingStop);
    return () => {
      socketService.off("message:new", handleMessage);
      socketService.off("typing:start", handleTyping);
      socketService.off("typing:stop", handleTypingStop);
    };
  }, [recipientId]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!recipientId || !content.trim()) return;
    const message = await messageService.send(recipientId, content.trim());
    setMessages((current) => [...current, message]);
    setContent("");
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl flex-col px-4 py-8">
      <div className="mb-6 flex items-center gap-3"><MessageCircle className="h-6 w-6 text-primary" /><h1 className="text-2xl font-bold">Messages</h1></div>
      <label className="mb-4 text-sm font-medium" htmlFor="recipient">Recipient user ID</label>
      <input id="recipient" value={recipientId} onChange={(event) => setRecipientId(event.target.value.trim())} placeholder="Enter a user ID to start chatting" className="mb-6 rounded-lg border bg-background px-3 py-2" />
      <div className="flex-1 space-y-3 overflow-y-auto rounded-xl border bg-card p-4">
        {messages.map((message) => {
          const senderId = typeof message.sender === "string" ? message.sender : message.sender?._id;
          return <div key={message._id} className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${senderId === currentUser?._id ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"}`}>{message.content}</div>;
        })}
        {typing && <p className="text-xs text-muted-foreground">Typing...</p>}
      </div>
      <form onSubmit={submit} className="mt-4 flex gap-2"><input value={content} onChange={(event) => setContent(event.target.value)} onFocus={() => recipientId && socketService.emit("typing:start", recipientId)} onBlur={() => recipientId && socketService.emit("typing:stop", recipientId)} placeholder="Write a message" className="min-w-0 flex-1 rounded-lg border bg-background px-3 py-2" /><button type="submit" aria-label="Send message" className="rounded-lg bg-primary p-3 text-primary-foreground"><Send className="h-4 w-4" /></button></form>
    </main>
  );
}
