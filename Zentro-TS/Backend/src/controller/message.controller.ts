import type { Request, Response } from "express";
import { createMessageService, getConversationService, markConversationReadService } from "../services/message.service.js";
import { getIO } from "../Socket/socket.js";
import { getSocketId } from "../Socket/userSocketMap.js";

export const getConversationController = async (req: Request<{ userId: string }>, res: Response) => {
  try {
    const data = await getConversationService(req.user!._id.toString(), req.params.userId, Number(req.query.page) || 1, Number(req.query.limit) || 50);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Unable to load messages" });
  }
};

export const sendMessageController = async (req: Request<{ userId: string }>, res: Response) => {
  try {
    const message = await createMessageService(req.user!._id.toString(), req.params.userId, String(req.body.content || ""));
    const populated = await message.populate("sender", "username fullname avatar");
    const socketId = getSocketId(req.params.userId);
    if (socketId) getIO().to(socketId).emit("message:new", populated);
    return res.status(201).json({ success: true, data: populated });
  } catch (error) {
    return res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Unable to send message" });
  }
};

export const markConversationReadController = async (req: Request<{ userId: string }>, res: Response) => {
  try {
    await markConversationReadService(req.user!._id.toString(), req.params.userId);
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Unable to mark messages read" });
  }
};
