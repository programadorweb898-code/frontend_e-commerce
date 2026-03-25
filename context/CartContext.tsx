"use client";

import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { CartApiItem, CartApiResponse, CartItem, CartProductInput } from "@/types";
import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: CartProductInput, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  restFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

const defaultCartContext: CartContextType = {
  cart: [],
  addToCart: async () => {},
  removeFromCart: async () => {},
  restFromCart: async () => {},
  clearCart: async () => {},
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const router = useRouter();
  
  const { data: cartData, isLoading: isLoadingCart } = useQuery<CartApiResponse>({
    queryKey: ['cart'],
    queryFn: () => api.getCart(),
    enabled: !!user, // Solo cargar si hay usuario
  });

  const cart = useMemo(() => {
    if (!cartData || !cartData.items) return [];
    return cartData.items.map((item: CartApiItem) => {
      const p = item.productId;
      return {
        productId: typeof p === 'object' ? p._id : p,
        name: typeof p === 'object' ? p.title : "Product",
        price: item.priceSnapShot || (typeof p === 'object' ? p.price : 0),
        quantity: item.quantity,
        image: typeof p === 'object' ? p.image : ""
      };
    });
  }, [cartData]);

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const totalPrice = useMemo(() => 
    cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), 
  [cart]);

  const addMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) => 
      api.addToCart(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => api.removeFromCart(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  });

  const restMutation = useMutation({
    mutationFn: (productId: string) => api.restFromCart(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  });

  const clearMutation = useMutation({
    mutationFn: () => api.clearCart(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  });

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart: async (p, q) => { 
          if (!user) {
            router.push("/login");
            return;
          }
          try {
            await addMutation.mutateAsync({ productId: p._id, quantity: q });
          } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Unknown error";
            if (message !== "SESSION_EXPIRED") {
              console.error("Add to cart failed:", message);
            }
          }
        },
        removeFromCart: async (id) => { await removeMutation.mutateAsync(id) },
        restFromCart: async (id) => { await restMutation.mutateAsync(id) },
        clearCart: async () => { await clearMutation.mutateAsync() },
        totalItems,
        totalPrice,
        isLoading: isLoadingCart || addMutation.isPending || removeMutation.isPending
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) return defaultCartContext;
  return context;
};
