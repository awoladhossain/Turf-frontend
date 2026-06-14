import api from './api';
import { Booking, CreateBookingDto } from '@/types/booking.types';

export interface PaginatedBookingsResponse {
  data: Booking[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

class BookingService {
  async createBooking(dto: CreateBookingDto): Promise<Booking> {
    const response = await api.post<Booking>('/bookings', dto);
    return response.data;
  }

  async getMyBookings(): Promise<PaginatedBookingsResponse> {
    const response = await api.get<PaginatedBookingsResponse>('/bookings/my');
    return response.data;
  }

  async getBookingById(id: string): Promise<Booking> {
    const response = await api.get<Booking>(`/bookings/${id}`);
    return response.data;
  }

  async cancelBooking(id: string): Promise<Booking> {
    const response = await api.patch<Booking>(`/bookings/${id}/cancel`);
    return response.data;
  }

  async getAllBookingsAdmin(page: number = 1, limit: number = 20): Promise<PaginatedBookingsResponse> {
    const response = await api.get<PaginatedBookingsResponse>('/bookings/admin/all', {
      params: { page, limit },
    });
    return response.data;
  }
}

const bookingService = new BookingService();
export default bookingService;
