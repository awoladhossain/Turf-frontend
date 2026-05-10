import { Slot } from "./turf.types";

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED';

export type PaymentStatus =
  | 'INITIATED'
  | 'PROCESSING'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED';

export interface Booking {
  id: string;
  userId: string;
  turfId: string;
  slotId: string;
  totalAmount: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  turf?: {
    id: string;
    name: string;
    address: string;
    city: string;
  };
  slot?: Slot;
  payment?: Payment;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: PaymentStatus;
  stripeClientSecret?: string;
  paidAt?: string;
  failureReason?: string;
}

export interface CreateBookingDto {
  turfId: string;
  slotId: string;
  date: string;
  notes?: string;
  couponCode?: string;
}