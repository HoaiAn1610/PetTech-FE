import '@testing-library/jest-dom';
import { afterEach, beforeAll, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './msw/server';

// Seed localStorage with a mock admin user so AuthProvider initializes as authenticated
const mockAdminUser = JSON.stringify({ id: 'test-admin', name: 'Test Admin', email: 'admin@pettech.io', role: 'SuperAdmin' });
beforeAll(() => {
  localStorage.setItem('token', 'test-token');
  localStorage.setItem('user', mockAdminUser);
  server.listen({ onUnhandledRequest: 'warn' });
});

// Clean up after each test
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

// Stop MSW after all tests
afterAll(() => server.close());

// Mock window.matchMedia (not available in jsdom)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver (used by Recharts, not available in jsdom)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock URL.createObjectURL for CSV export tests
Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: vi.fn(() => 'blob:mock-url'),
});
Object.defineProperty(URL, 'revokeObjectURL', {
  writable: true,
  value: vi.fn(),
});

// Silence expected console errors in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('ReactDOM.render')) return;
    originalError(...args);
  };
});
afterAll(() => {
  console.error = originalError;
});
