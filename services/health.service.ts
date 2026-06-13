import api from './api';

export interface HealthStatusResponse {
  status: string;
  timestamp: string;
  services: {
    database: string;
    redis: string;
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
