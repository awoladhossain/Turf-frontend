import api from './api';
import { AuthResponse, LoginDto, RegisterDto, User } from '@/types/auth.types';

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
}

const authService = new AuthService();
export default authService;
