export type SportType = 'FOOTBALL' | 'CRICKET' | 'BOTH';

export interface Turf {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  sportType: SportType;
  pricePerHour: number;
  openTime: string;
  closeTime: string;
  isActive: boolean;
  images: string[];
  createdAt: string;
}

export interface Slot {
  id: string;
  turfId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface TurfQueryParams {
  page?: number;
  limit?: number;
  city?: string;
  sportType?: SportType;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  availableDate?: string;
}
