export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
  timestamp: string;
  requestId: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  errors?: string[];
  timestamp: string;
  path: string;
}
