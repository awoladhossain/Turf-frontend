import api from './api';
import { Turf, TurfQueryParams } from '@/types/turf.types';

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
}

const turfService = new TurfService();
export default turfService;
