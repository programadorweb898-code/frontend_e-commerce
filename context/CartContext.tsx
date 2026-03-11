"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { Product, CartItem } from "@/types";
import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  restFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  
  // En una app real, aquí usarías useQuery para obtener el carrito del backend
  // Por ahora lo mantendremos sincronizado vía mutaciones
  const cart: CartItem[] = []; // Este dato vendría de un useQuery(['cart'])

  const addMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) => 
      api.addToCart(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  const removeMutation = useMutation({
    mutationFn: api.removeFromCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  });

  const restMutation = useMutation({
    mutationFn: api.restFromCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  });

  const clearMutation = useMutation({
    mutationFn: api.clearCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  });

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart: async (p, q) => { await addMutation.mutateAsync({ productId: p._id, quantity: q }) },
        removeFromCart: async (id) => { await removeMutation.mutateAsync(id) },
        restFromCart: async (id) => { await restMutation.mutateAsync(id) },
        clearCart: async () => { await clearMutation.mutateAsync() },
        totalItems: 0, // Calculado desde query data
        totalPrice: 0,
        isLoading: addMutation.isPending || removeMutation.isPending
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
