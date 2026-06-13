import api from './api';
import { AuthResponse, LoginDto, RegisterDto, User, AuthTokens } from '@/types/auth.types';

class AuthService {
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  }

  async register(userData: RegisterDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  }

  async getMe(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  }

  async updateProfile(profileData: { name: string; phone: string }): Promise<User> {
    const response = await api.put<User>('/auth/update-profile', profileData);
    return response.data;
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    const response = await api.post<AuthTokens>(
      '/auth/refresh',
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    return response.data;
  }

  async logout(refreshToken: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/logout', { refreshToken });
    return response.data;
  }

  async logoutAll(): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/logout-all');
    return response.data;
  }
}

const authService = new AuthService();
export default authService;

