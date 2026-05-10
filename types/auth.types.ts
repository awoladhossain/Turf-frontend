export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  isVerified: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  phone: string;
  password: string;
}