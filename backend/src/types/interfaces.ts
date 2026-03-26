// Shared TypeScript interfaces - IUser, ICourt, IBooking, ITimeSlot, IMessage, etc.

import { Document } from 'mongoose';
import { UserRole, BookingStatus, CourtType } from './enums';

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
  avatar?: string;
  walletBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICourt extends Document {
  name: string;
  type: CourtType;
  hourlyRate: number;
  image: string;
  location: string;
  openTime: string;  // "06:00"
  closeTime: string; // "22:00"
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBooking extends Document {
  userId: string;
  courtId: string;
  date: string;           // "YYYY-MM-DD"
  slots: string[];        // ["10:00", "11:00"]
  totalPrice: number;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITimeSlot {
  id: string;
  startTime: string;  // "HH:00"
  endTime: string;     // "HH:00"
  isAvailable: boolean;
  price: number;
}
