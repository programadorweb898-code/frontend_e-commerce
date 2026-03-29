import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from '../page';
import { AuthContext } from '../../../context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('lucide-react', () => ({
  Mail: () => <div data-testid="mail-icon" />,
  Lock: () => <div data-testid="lock-icon" />,
  Loader2: () => <div data-testid="loader-icon" />,
  AlertCircle: () => <div data-testid="alert-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  EyeOff: () => <div data-testid="eyeoff-icon" />,
  ShoppingCart: () => <div data-testid="cart-icon" />,
  Menu: () => <div data-testid="menu-icon" />,
  User: () => <div data-testid="user-icon" />,
  X: () => <div data-testid="x-icon" />,
  LogOut: () => <div data-testid="logout-icon" />,
  Search: () => <div data-testid="search-icon" />,
}));

vi.mock('@/components/Navbar', () => ({
  Navbar: () => <nav data-testid="mock-navbar">Navbar</nav>,
}));

const mockLogin = vi.fn();

const mockAuthContext = {
  user: null,
  login: mockLogin,
  logout: vi.fn(),
  register: vi.fn(),
  loading: false,
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const renderLoginPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={mockAuthContext}>
        <LoginPage />
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar el formulario de login correctamente', () => {
    renderLoginPage();
    
    expect(screen.getByText(/Welcome Back/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/name@example.com/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Sign In Now/i })).toBeDefined();
  });

  it('debe mostrar errores de validación si los campos están vacíos', async () => {
    renderLoginPage();
    
    const submitButton = screen.getByRole('button', { name: /Sign In Now/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeDefined();
      expect(screen.getByText(/Password is required/i)).toBeDefined();
    });
  });

  it('debe llamar a la función login con los datos correctos al enviar el formulario', async () => {
    renderLoginPage();
    
    const emailInput = screen.getByPlaceholderText(/name@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const submitButton = screen.getByRole('button', { name: /Sign In Now/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
