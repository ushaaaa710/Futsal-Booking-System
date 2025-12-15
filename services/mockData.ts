import { User, UserRole, Court, Booking, BookingStatus } from '../types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Aarav Sharma',
  email: 'aarav@courtsync.np',
  phone: '+977 980-1234567',
  role: UserRole.USER,
  walletBalance: 2500.00,
  avatar: 'https://ui-avatars.com/api/?name=Aarav+Sharma&background=00d4ff&color=000'
};

export const MOCK_ADMIN: User = {
  id: 'a1',
  name: 'Rajesh Hamal',
  email: 'admin@courtsync.np',
  role: UserRole.ADMIN,
  walletBalance: 0,
  avatar: 'https://ui-avatars.com/api/?name=Rajesh+Hamal&background=39ff14&color=000'
};

export const COURTS: Court[] = [
  {
    id: 'c1',
    name: 'Dhuku Futsal Hub',
    type: 'INDOOR',
    hourlyRate: 1500,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2936&auto=format&fit=crop'
  },
  {
    id: 'c2',
    name: 'Sankhamul Futsal',
    type: 'OUTDOOR',
    hourlyRate: 1200,
    image: 'https://images.unsplash.com/photo-1518605348400-437731df8a04?q=80&w=2940&auto=format&fit=crop'
  },
  {
    id: 'c3',
    name: 'Velocity Arena',
    type: 'INDOOR',
    hourlyRate: 2000,
    image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=2574&auto=format&fit=crop'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    userId: 'u1',
    courtId: 'c1',
    courtName: 'Dhuku Futsal Hub',
    date: new Date().toISOString().split('T')[0],
    slots: ['17:00', '18:00'],
    totalPrice: 3000,
    status: BookingStatus.CONFIRMED,
    createdAt: new Date().toISOString()
  },
  {
    id: 'b2',
    userId: 'u2',
    courtId: 'c2',
    courtName: 'Sankhamul Futsal',
    date: new Date().toISOString().split('T')[0],
    slots: ['19:00'],
    totalPrice: 1200,
    status: BookingStatus.PENDING,
    createdAt: new Date().toISOString()
  },
  {
    id: 'b3',
    userId: 'u1',
    courtId: 'c3',
    courtName: 'Velocity Arena',
    date: '2023-11-15',
    slots: ['07:00', '08:00'],
    totalPrice: 4000,
    status: BookingStatus.COMPLETED,
    createdAt: '2023-11-10T10:00:00Z'
  }
];
