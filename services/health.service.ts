import api from './api';

export interface HealthStatusResponse {
  status: string;
  timestamp?: string;
  info?: {
    database?: { status: string };
    redis?: { status: string };
    bull?: { status: string };
  };
  details?: {
    database?: { status: string };
    redis?: { status: string };
    bull?: { status: string };
  };
}

class HealthService {
  async getHealthStatus(): Promise<HealthStatusResponse> {
    const response = await api.get<HealthStatusResponse>('/health');
    return response.data;
  }
}

const healthService = new HealthService();
export default healthService;
