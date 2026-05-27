import api from './api';
import { Turf, TurfQueryParams, Slot } from '@/types/turf.types';

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

class TurfService {
  async getAllTurfs(params?: TurfQueryParams): Promise<PaginatedResponse<Turf>> {
    const cleanParams: any = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          cleanParams[key] = value;
        }
      });
    }

    const response = await api.get<PaginatedResponse<Turf>>('/turfs', {
      params: cleanParams,
    });
    return response.data;
  }

  async getTurfById(id: string): Promise<Turf> {
    const response = await api.get<Turf>(`/turfs/${id}`);
    return response.data;
  }

  async getTurfSlots(id: string, date: string): Promise<{ turf: Turf; slots: Slot[]; date: string }> {
    const response = await api.get<{ turf: Turf; slots: Slot[]; date: string }>(`/turfs/${id}/slots`, {
      params: { date },
    });
    return response.data;
  }

  async createTurf(dto: {
    name: string;
    description?: string;
    address: string;
    city: string;
    sportType: 'FOOTBALL' | 'CRICKET' | 'BOTH';
    pricePerHour: number;
    openTime: string;
    closeTime: string;
    images?: string[];
  }): Promise<Turf> {
    const response = await api.post<Turf>('/turfs', dto);
    return response.data;
  }

  async updateTurf(id: string, dto: Partial<{
    name: string;
    description: string;
    address: string;
    city: string;
    sportType: 'FOOTBALL' | 'CRICKET' | 'BOTH';
    pricePerHour: number;
    openTime: string;
    closeTime: string;
    images?: string[];
  }>): Promise<Turf> {
    const response = await api.patch<Turf>(`/turfs/${id}`, dto);
    return response.data;
  }

  async deleteTurf(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/turfs/${id}`);
    return response.data;
  }
}

const turfService = new TurfService();
export default turfService;
