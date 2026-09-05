import { axiosInstance } from "@/shared/lib/axios";

export interface Message {
  _id: string;
  sender: string | { _id: string; username: string; fullname: string; avatar?: string };
  recipient: string;
  content: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  readAt?: string;
  createdAt: string;
}

export interface ConversationSummary {
  partnerId: string;
  username: string;
  fullname: string;
  avatar?: string;
  lastMessage: {
    _id: string;
    content: string;
    mediaType?: "image" | "video";
    sender: string;
    createdAt: string;
    readAt?: string;
  };
  unreadCount: number;
}

export interface UserSearchResult {
  _id: string;
  username: string;
  fullname: string;
  avatar?: string;
  bio?: string;
}

export const messageService = {
  getInbox: async () => {
    const response = await axiosInstance.get<{ data: ConversationSummary[] }>("/messages/inbox");
    return response.data.data;
  },
  getConversation: async (userId: string) => {
    const response = await axiosInstance.get<{ data: { messages: Message[] } }>(`/messages/${userId}`);
    return response.data.data.messages;
  },
  send: async (userId: string, content: string) => {
    const response = await axiosInstance.post<{ data: Message }>(`/messages/${userId}`, { content });
    return response.data.data;
  },
  markRead: async (userId: string) => {
    await axiosInstance.patch(`/messages/${userId}/read`);
  },
  searchUsers: async (query: string) => {
    if (!query.trim()) return [] as UserSearchResult[];
    const response = await axiosInstance.get<{ users: UserSearchResult[] }>("/search/users", { params: { q: query, limit: 8 } });
    return response.data.users;
  },
};