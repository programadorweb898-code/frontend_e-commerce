import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CartPage from '../page';
import { useCart } from '@/context/CartContext';
import { api } from '@/lib/api';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt || 'image'} />,
}));

vi.mock('@/components/Navbar', () => ({
  Navbar: () => <div data-testid="mock-navbar">Navbar</div>,
}));

vi.mock('lucide-react', () => ({
  Trash2: () => <div data-testid="trash-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  Minus: () => <div data-testid="minus-icon" />,
  ArrowRight: () => <div data-testid="arrow-right-icon" />,
}));

vi.mock('@/lib/api', () => ({
  api: {
    createCheckoutSession: vi.fn(),
  },
}));

vi.mock('@/context/CartContext', () => ({
  useCart: vi.fn(),
}));

const mockedUseCart = vi.mocked(useCart);
const mockedCreateCheckoutSession = vi.mocked(api.createCheckoutSession);

describe('CartPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseCart.mockReset();
    mockedCreateCheckoutSession.mockReset();
  });

  it('muestra mensaje cuando el carrito está vacío', () => {
    mockedUseCart.mockReturnValue({
      cart: [],
      removeFromCart: vi.fn(),
      restFromCart: vi.fn(),
      addToCart: vi.fn(),
      totalPrice: 0,
      clearCart: vi.fn(),
    });

    render(<CartPage />);

    expect(screen.getByText(/Your cart is empty/i)).toBeDefined();
    expect(screen.getByText(/Continue Shopping/i)).toBeDefined();
  });

  it('muestra elementos del carrito y cumple acciones', async () => {
    const mockClearCart = vi.fn();
    const mockRemoveFromCart = vi.fn();
    const mockRestFromCart = vi.fn();
    const mockAddToCart = vi.fn();
    const product = {
      productId: '1',
      name: 'Producto de Prueba',
      price: 50,
      quantity: 2,
      image: '/image.jpg',
    };

    mockedUseCart.mockReturnValue({
      cart: [product],
      removeFromCart: mockRemoveFromCart,
      restFromCart: mockRestFromCart,
      addToCart: mockAddToCart,
      totalPrice: 100,
      clearCart: mockClearCart,
    });

    mockedCreateCheckoutSession.mockResolvedValue({ url: 'https://checkout.example.com' });

    // `window.location` escritura es peligrosa, por eso escapamos.
    const oldLocation = window.location;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: 'http://localhost' },
    });

    render(<CartPage />);

    expect(screen.getByText(product.name)).toBeDefined();
    const priceElements = screen.getAllByText('$100.00');
    expect(priceElements.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/Order Summary/i)).toBeDefined();

    fireEvent.click(screen.getByText(/Clear entire cart/i));
    expect(mockClearCart).toHaveBeenCalledTimes(1);

    const minusButton = screen.getByTestId('minus-icon').closest('button');
    const plusButton = screen.getByTestId('plus-icon').closest('button');
    const trashButton = screen.getByTestId('trash-icon').closest('button');

    if (minusButton) fireEvent.click(minusButton);
    if (plusButton) fireEvent.click(plusButton);
    if (trashButton) fireEvent.click(trashButton);

    expect(mockRestFromCart).toHaveBeenCalledWith(product.productId);
    expect(mockAddToCart).toHaveBeenCalledWith({
      _id: product.productId,
      name: product.name,
      price: product.price,
      image: product.image,
    },
    1);
    expect(mockRemoveFromCart).toHaveBeenCalledWith(product.productId);

    fireEvent.click(screen.getByText(/Proceed to Checkout/i));

    await waitFor(() => {
      expect(mockedCreateCheckoutSession).toHaveBeenCalledTimes(1);
      expect(window.location.href).toBe('https://checkout.example.com');
    });

    Object.defineProperty(window, 'location', {
      writable: true,
      value: oldLocation,
    });
  });
});
