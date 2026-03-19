import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../AuthContext';
import { api } from '@/lib/api';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/',
}));

vi.mock('@/lib/api', () => ({
  api: {
    login: vi.fn(),
    getMe: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    refreshToken: vi.fn(),
    setOnUnauthorized: vi.fn(),
  },
}));

function AuthConsumer() {
  const { user, loading, login, register, logout } = useAuth();

  return (
    <div>
      <div>user: {user ? user.email : 'null'}</div>
      <div>loading: {loading ? 'true' : 'false'}</div>
      <button onClick={() => login({ email: 'x', password: 'y' })}>login</button>
      <button onClick={() => register({ email: 'x', password: 'y' })}>register</button>
      <button onClick={() => logout()}>logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.refreshToken).mockResolvedValue(false);
    vi.mocked(api.setOnUnauthorized).mockClear();
  });

  it('inicia con user null y luego carga finalizada', async () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    expect(screen.getByText(/user: null/i)).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText(/loading: false/i)).toBeDefined();
    });

    expect(vi.mocked(api.setOnUnauthorized)).toHaveBeenCalled();
  });

  it('login actualiza usuario y redirige', async () => {
    vi.mocked(api.login).mockResolvedValue({ token: 'abc' });
    vi.mocked(api.getMe).mockResolvedValue({ _id: '1', email: 'test@example.com', role: 'user' });

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(vi.mocked(api.login)).toHaveBeenCalledWith({ email: 'x', password: 'y' });
      expect(vi.mocked(api.getMe)).toHaveBeenCalled();
      expect(screen.getByText(/user: test@example.com/i)).toBeDefined();
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('register llama api y redirige', async () => {
    vi.mocked(api.register).mockResolvedValue({});

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(vi.mocked(api.register)).toHaveBeenCalledWith({ email: 'x', password: 'y' });
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('logout borra usuario y redirige', async () => {
    vi.mocked(api.logout).mockResolvedValue({});
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    await waitFor(() => {
      expect(vi.mocked(api.logout)).toHaveBeenCalled();
      expect(screen.getByText(/user: null/i)).toBeDefined();
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });
});
