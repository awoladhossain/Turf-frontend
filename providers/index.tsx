'use client';

import '@/lib/i18n'; // i18n সবার উপরে ইম্পোর্ট থাকুক
import { persistor, store } from '@/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    // ১. ThemeProvider কে সবার বাইরে নিয়ে আসুন
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {/* ২. এরপর Redux Provider */}
      <Provider store={store}>
        {/* ৩. এরপর PersistGate */}
        <PersistGate loading={null} persistor={persistor}>
          {/* ৪. সবার শেষে QueryClientProvider */}
          <QueryClientProvider client={queryClient}>
            {children}
            
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  borderRadius: '8px',
                  fontSize: '14px',
                },
                success: { duration: 3000 },
                error: { duration: 5000 },
              }}
            />

            {process.env.NODE_ENV === 'development' && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}