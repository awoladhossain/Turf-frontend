import api from './api';
import { Payment } from '@/types/booking.types';

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

class PaymentService {
  async createPaymentIntent(bookingId: string): Promise<PaymentIntentResponse> {
    const response = await api.post<PaymentIntentResponse>('/payment/create-payment-intent', {
      bookingId,
    });
    return response.data;
  }

  async verifyPaymentStatus(bookingId: string): Promise<Payment> {
    const response = await api.post<Payment>(`/payment/booking/${bookingId}`);
    return response.data;
  }

  async refundPayment(bookingId: string): Promise<Payment> {
    const response = await api.post<Payment>(`/payment/refund/${bookingId}`);
    return response.data;
  }
}

const paymentService = new PaymentService();
export default paymentService;
