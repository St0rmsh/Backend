import mongoose from "mongoose";
import MessageModel from "../model/message.model.js";
import UserModel from "../model/auth.model.js";

export const getConversationService = async (userId: string, otherUserId: string, page = 1, limit = 50) => {
  if (!mongoose.Types.ObjectId.isValid(otherUserId)) throw new Error("Invalid user ID");
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(100, Math.max(1, limit));
  const filter = { $or: [{ sender: userId, recipient: otherUserId }, { sender: otherUserId, recipient: userId }] };
  const [messages, total] = await Promise.all([
    MessageModel.find(filter).populate("sender", "username fullname avatar").sort({ createdAt: 1 }).skip((safePage - 1) * safeLimit).limit(safeLimit).lean(),
    MessageModel.countDocuments(filter),
  ]);
  return { messages, total, page: safePage, hasMore: safePage * safeLimit < total };
};

export const createMessageService = async (sender: string, recipient: string, content: string, mediaUrl?: string, mediaType?: "image" | "video") => {
  if (!mongoose.Types.ObjectId.isValid(recipient)) throw new Error("Invalid recipient");
  if (!content.trim() && !mediaUrl) throw new Error("Message cannot be empty");
  if (sender === recipient) throw new Error("You cannot message yourself");
  const user = await UserModel.findById(recipient).select("_id isActive").lean();
  if (!user?.isActive) throw new Error("Recipient not found");
  const messageData = { sender, recipient, content: content.trim() } as { sender: string; recipient: string; content: string; mediaUrl?: string; mediaType?: "image" | "video" };
  if (mediaUrl) messageData.mediaUrl = mediaUrl;
  if (mediaType) messageData.mediaType = mediaType;
  return MessageModel.create(messageData);
};

export const markConversationReadService = async (userId: string, senderId: string) => {
  await MessageModel.updateMany({ sender: senderId, recipient: userId, readAt: { $exists: false } }, { $set: { readAt: new Date() } });
};
