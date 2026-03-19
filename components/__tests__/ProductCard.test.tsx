import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProductCard } from '../ProductCard';
import { CartContext } from '../../context/CartContext';

const mockProduct = {
  _id: '1',
  title: 'Producto de Prueba',
  description: 'Descripción de prueba',
  price: 100,
  category: 'Electrónica',
  image: '/test-image.jpg',
  stock: 10,
};

const mockCartContext = {
  cartItems: [],
  addToCart: vi.fn(),
  removeFromCart: vi.fn(),
  clearCart: vi.fn(),
  cartCount: 0,
  totalPrice: 0,
};

describe('ProductCard', () => {
  it('debe renderizar la información del producto correctamente', () => {
    render(
      <CartContext.Provider value={mockCartContext}>
        <ProductCard product={mockProduct} />
      </CartContext.Provider>
    );

    expect(screen.getByText(mockProduct.title)).toBeDefined();
    expect(screen.getByText(mockProduct.category)).toBeDefined();
    expect(screen.getByText('$100.00')).toBeDefined();
  });

  it('debe llamar a addToCart cuando se hace clic en el botón del carrito', () => {
    render(
      <CartContext.Provider value={mockCartContext}>
        <ProductCard product={mockProduct} />
      </CartContext.Provider>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockCartContext.addToCart).toHaveBeenCalledWith(mockProduct, 1);
  });
});
