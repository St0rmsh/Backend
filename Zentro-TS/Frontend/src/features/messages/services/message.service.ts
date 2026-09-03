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

export const messageService = {
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
};
