'use client';

import { useMutation } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCredentials, logout as logoutAction } from '@/store/slices/authSlice';
import authService from '@/services/auth.service';
import { LoginDto, RegisterDto } from '@/types/auth.types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // 1. Redux from Auth State
  const { user, isAuthenticated, accessToken } = useAppSelector((state) => state.auth);

  // 2. TanStack Query Mutation: LOGIN
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginDto) => authService.login(credentials),
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      toast.success('Successfully logged in! ⚽');
      router.push('/'); // Redirect to homepage or dashboard
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Invalid email or password!';
      toast.error(message);
    },
  });

  // 3. TanStack Query Mutation: REGISTER
  const registerMutation = useMutation({
    mutationFn: (userData: RegisterDto) => authService.register(userData),
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      toast.success('Account created successfully! 🏆');
      router.push('/');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Registration failed. Try again!';
      toast.error(message);
    },
  });

  // 4. LOGOUT Action
  const logout = () => {
    dispatch(logoutAction());
    toast.success('Logged out successfully.');
    router.push('/login');
  };

  return {
    // Auth States
    user,
    isAuthenticated,
    accessToken,
    
    // Login Action & State
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    // Register Action & State
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    // Logout Action
    logout,
  };
}
