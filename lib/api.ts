import { Product, User, CartItem, Order } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

class ApiClient {
  private accessToken: string | null = null;
  private onUnauthorized: (() => void) | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.accessToken = localStorage.getItem("accessToken");
    }
  }

  setOnUnauthorized(callback: () => void) {
    this.onUnauthorized = callback;
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("accessToken", token);
      } else {
        localStorage.removeItem("accessToken");
      }
    }
  }

  async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = new Headers(options.headers);

    if (this.accessToken) {
      headers.set("Authorization", `Bearer ${this.accessToken}`);
    }

    if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // Important for cookies
    });

    if (response.status === 401 && endpoint !== "/api/login") {
      // Try to refresh token
      const refreshed = await this.refreshToken();
      if (refreshed) {
        return this.fetch<T>(endpoint, options);
      } else {
        if (this.onUnauthorized) {
          this.onUnauthorized();
        }
        throw new Error("SESSION_EXPIRED");
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const errorMessage = error.message || error.error || response.statusText || "Request failed";
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/refreshToken`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const { accessToken } = await response.json();
        this.setAccessToken(accessToken);
        return true;
      }
    } catch (error) {
      console.error("Token refresh failed", error);
    }
    this.setAccessToken(null);
    return false;
  }

  // Products
  async getProducts(search?: string, min?: number, max?: number): Promise<Product[]> {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (min) params.append("min", min.toString());
    if (max) params.append("max", max.toString());
    
    const url = `/products/getProducts?${params.toString()}`;
    const data = await this.fetch<{ productos: Product[] }>(url);
    return data.productos;
  }

  async getProduct(id: string): Promise<Product> {
    const data = await this.fetch<{ producto: Product }>(`/products/getProduct/${id}`);
    return data.producto;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const data = await this.fetch<{ productos: Product[] }>(`/products/categoryProducts/${category}`);
    return data.productos;
  }

  // Auth
  async getMe(): Promise<User> {
    return this.fetch<User>("/api/me");
  }

  async login(credentials: any): Promise<{ accessToken: string; message: string }> {
    const data = await this.fetch<{ accessToken: string; message: string }>("/api/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    this.setAccessToken(data.accessToken);
    return data;
  }

  async register(data: any): Promise<any> {
    return this.fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    await this.fetch("/api/logout", { method: "POST" });
    this.setAccessToken(null);
  }

  // Cart
  async getCart(): Promise<any> {
    return this.fetch("/products/getCart");
  }

  async addToCart(productId: string, quantity: number): Promise<any> {
    return this.fetch("/products/addProduct", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async removeFromCart(productId: string): Promise<any> {
    return this.fetch(`/products/deleteProduct/${productId}`, { method: "DELETE" });
  }

  async restFromCart(productId: string): Promise<any> {
    return this.fetch(`/products/restProduct/${productId}`, { method: "PATCH" });
  }

  async clearCart(): Promise<any> {
    return this.fetch("/products/deleteCart", { method: "DELETE" });
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    const data = await this.fetch<{ orders: Order[] }>("/api/orders");
    return data.orders || [];
  }

  async checkout(paymentIntentId?: string): Promise<any> {
    return this.fetch("/api/orders/checkout", {
      method: "POST",
      body: JSON.stringify({ paymentIntentId }),
    });
  }

  // Payments
  async createCheckoutSession(): Promise<{ url: string }> {
    return this.fetch<{ url: string }>("/payments/checkout", { method: "POST" });
  }
}

export const api = new ApiClient();
