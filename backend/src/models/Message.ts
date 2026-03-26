// Chat message database model with sender/receiver references and timestamps

import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  senderId: string;
  receiverId: string;
  bookingId?: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    senderId: {
      type: String,
      required: true,
      ref: "User",
    },
    receiverId: {
      type: String,
      required: true,
      ref: "User",
    },
    bookingId: {
      type: String,
      ref: "Booking",
      default: null,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ bookingId: 1 });

const Message = mongoose.model<IMessage>("Message", messageSchema);

export default Message;
