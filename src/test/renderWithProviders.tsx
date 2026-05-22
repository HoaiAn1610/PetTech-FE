import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';
import { AuthProvider } from '@/context/AuthContext';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

interface Options extends RenderOptions {
  initialEntries?: string[];
}

export function renderWithProviders(ui: React.ReactElement, { initialEntries = ['/'], ...opts }: Options = {}) {
  const queryClient = createTestQueryClient();
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MemoryRouter initialEntries={initialEntries}>
            {children}
          </MemoryRouter>
        </AuthProvider>
      </QueryClientProvider>
    );
  }
  return { queryClient, ...render(ui, { wrapper: Wrapper, ...opts }) };
}
