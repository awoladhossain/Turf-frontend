'use client';

import authService from '@/services/auth.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout as logoutAction, setCredentials, updateUser } from '@/store/slices/authSlice';
import { LoginDto, RegisterDto } from '@/types/auth.types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import axios, { AxiosError } from 'axios';
import { ApiError } from '@/types/api.types';

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // 1. Redux from Auth State
  const { user, isAuthenticated, accessToken, refreshToken } = useAppSelector((state) => state.auth);

  // 2. TanStack Query: GET ME (Auto-sync fresh profile details on mount/refresh)
  const {
    data: freshUser,
    isLoading: isFetchingMe,
    refetch: refetchMe,
    error: meError,
  } = useQuery({
    queryKey: ['auth-me'],
    queryFn: () => authService.getMe(),
    enabled: !!accessToken && isAuthenticated,
    retry: false,
  });

  // Auto-sync fresh data to Redux when query succeeds
  useEffect(() => {
    if (freshUser) {
      dispatch(updateUser(freshUser));
    }
  }, [freshUser, dispatch]);

  // Handle unauthorized getMe error (Expired token)
  useEffect(() => {
    if (meError && axios.isAxiosError(meError)) {
      const status = meError.response?.status;
      if (status === 401) {
        dispatch(logoutAction());
      }
    }
  }, [meError, dispatch]);

  // 3. TanStack Query Mutation: LOGIN
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginDto) => authService.login(credentials),
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      toast.success('Successfully logged in! ⚽');
      const redirectPath =
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('redirect') || '/'
          : '/';
      router.push(redirectPath);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message || 'Invalid email or password!';
      toast.error(message);
    },
  });

  // 4. TanStack Query Mutation: REGISTER
  const registerMutation = useMutation({
    mutationFn: (userData: RegisterDto) => authService.register(userData),
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      toast.success('Account created successfully! 🏆');
      router.push('/');
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message || 'Registration failed. Try again!';
      toast.error(message);
    },
  });

  // 5. TanStack Query Mutation: UPDATE PROFILE
  const updateProfileMutation = useMutation({
    mutationFn: (profileData: { name: string; phone: string }) =>
      authService.updateProfile(profileData),
    onSuccess: (data) => {
      dispatch(updateUser(data));
      toast.success('Profile updated successfully! 👤');
      refetchMe(); // Refresh the getMe query
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message || 'Failed to update profile. Try again!';
      toast.error(message);
    },
  });

  // 6. LOGOUT Action
  const logout = () => {
    if (refreshToken) {
      authService.logout(refreshToken).catch((err) => {
        console.error('Failed to revoke token on backend:', err);
      });
    }
    dispatch(logoutAction());
    toast.success('Logged out successfully.');
    router.push('/login');
  };

  return {
    // Auth States
    user,
    isAuthenticated,
    accessToken,
    isFetchingMe,
    refetchMe,

    // Login Action & State
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    // Register Action & State
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    // Update Profile Action & State
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateProfileError: updateProfileMutation.error,

    // Logout Action
    logout,
  };
}
