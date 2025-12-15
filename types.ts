export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  walletBalance: number;
}

export interface Court {
  id: string;
  name: string;
  type: 'INDOOR' | 'OUTDOOR';
  hourlyRate: number;
  image: string;
}

export interface TimeSlot {
  id: string;
  startTime: string; // HH:00
  endTime: string;   // HH:00
  isAvailable: boolean;
  price: number;
}

export interface Booking {
  id: string;
  userId: string;
  courtId: string;
  courtName: string;
  date: string; // YYYY-MM-DD
  slots: string[]; // Array of start times e.g. ["10:00", "11:00"]
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}