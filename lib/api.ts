import { Product, User, Order, LoginCredentials, RegisterPayload, CartApiResponse } from "@/types";

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
      credentials: "include",
    });

    if (response.status === 401 && endpoint !== "/api/login") {
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
      const error: Record<string, unknown> = await response.json().catch(() => ({}));
      const errorMessage =
        (typeof error.message === "string" && error.message) ||
        (typeof error.error === "string" && error.error) ||
        response.statusText ||
        "Request failed";
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

  async getMe(): Promise<User> {
    return this.fetch<User>("/api/me");
  }

  async login(credentials: LoginCredentials): Promise<{ accessToken: string; message: string }> {
    const data = await this.fetch<{ accessToken: string; message: string }>("/api/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    this.setAccessToken(data.accessToken);
    return data;
  }

  async register(data: RegisterPayload): Promise<Record<string, unknown>> {
    return this.fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    await this.fetch("/api/logout", { method: "POST" });
    this.setAccessToken(null);
  }

  async getCart(): Promise<CartApiResponse> {
    return this.fetch<CartApiResponse>("/products/getCart");
  }

  async addToCart(productId: string, quantity: number): Promise<CartApiResponse> {
    return this.fetch<CartApiResponse>("/products/addProduct", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async removeFromCart(productId: string): Promise<CartApiResponse> {
    return this.fetch<CartApiResponse>(`/products/deleteProduct/${productId}`, { method: "DELETE" });
  }

  async restFromCart(productId: string): Promise<CartApiResponse> {
    return this.fetch<CartApiResponse>(`/products/restProduct/${productId}`, { method: "PATCH" });
  }

  async clearCart(): Promise<Record<string, unknown>> {
    return this.fetch<Record<string, unknown>>("/products/deleteCart", { method: "DELETE" });
  }

  async getOrders(): Promise<Order[]> {
    const data = await this.fetch<{ orders: Order[] }>("/api/orders");
    return data.orders || [];
  }

  async checkout(paymentIntentId?: string): Promise<Record<string, unknown>> {
    return this.fetch<Record<string, unknown>>("/api/orders/checkout", {
      method: "POST",
      body: JSON.stringify({ paymentIntentId }),
    });
  }

  async createCheckoutSession(lang?: string): Promise<{ url: string }> {
    return this.fetch<{ url: string }>("/payments/checkout", { 
      method: "POST",
      body: JSON.stringify({ lang })
    });
  }

  async confirmPayment(sessionId: string, lang: string = "es"): Promise<Record<string, unknown>> {
    return this.fetch<Record<string, unknown>>("/payments/confirm-payment", {
      method: "POST",
      body: JSON.stringify({ session_id: sessionId, lang }),
    });
  }
}

export const api = new ApiClient();
