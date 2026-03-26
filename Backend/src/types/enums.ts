// Application enums - UserRole, BookingStatus, CourtType, PaymentStatus, etc.

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum CourtType {
  INDOOR = 'INDOOR',
  OUTDOOR = 'OUTDOOR',
}
