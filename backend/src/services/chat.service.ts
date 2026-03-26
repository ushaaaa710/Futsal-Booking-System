// Chat service - Message handling and conversation grouping logic

import Message, { IMessage } from "../models/Message";

/**
 * Send a new message.
 */
export const sendMessage = async (data: {
  senderId: string;
  receiverId: string;
  content: string;
  bookingId?: string;
}): Promise<IMessage> => {
  const message = await Message.create(data);
  return message;
};

/**
 * Get messages between two users.
 */
export const getConversation = async (
  userId1: string,
  userId2: string,
  limit: number = 50,
): Promise<IMessage[]> => {
  return Message.find({
    $or: [
      { senderId: userId1, receiverId: userId2 },
      { senderId: userId2, receiverId: userId1 },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(limit);
};

/**
 * Get all conversations for a user (latest message from each conversation).
 */
export const getUserConversations = async (
  userId: string,
): Promise<IMessage[]> => {
  return Message.aggregate([
    {
      $match: {
        $or: [{ senderId: userId }, { receiverId: userId }],
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: {
          $cond: [
            { $lt: ["$senderId", "$receiverId"] },
            { a: "$senderId", b: "$receiverId" },
            { a: "$receiverId", b: "$senderId" },
          ],
        },
        lastMessage: { $first: "$$ROOT" },
      },
    },
    { $replaceRoot: { newRoot: "$lastMessage" } },
    { $sort: { createdAt: -1 } },
  ]);
};

/**
 * Mark messages as read.
 */
export const markAsRead = async (
  senderId: string,
  receiverId: string,
): Promise<void> => {
  await Message.updateMany(
    { senderId, receiverId, isRead: false },
    { isRead: true },
  );
};
