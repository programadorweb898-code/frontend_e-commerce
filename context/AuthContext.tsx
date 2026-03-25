"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, LoginCredentials, RegisterPayload } from "@/types";
import { api } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultAuthContext: AuthContextType = {
  user: null,
  loading: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Configurar el callback de no autorizado
    api.setOnUnauthorized(() => {
      setUser(null);
      localStorage.removeItem("accessToken");
      router.push("/login");
    });

    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      
      // 1. Verificación inicial de carga (solo una vez)
      if (loading) {
        try {
          if (token) {
            const refreshed = await api.refreshToken();
            if (refreshed) {
               const userData = await api.getMe();
               setUser(userData);
            } else {
               setUser(null);
               localStorage.removeItem("accessToken");
            }
          }
        } catch (error) {
          console.error("Auth init failed", error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      }

      // 2. Protección de rutas (en cada cambio de pathname)
      const privateRoutes = ["/cart", "/orders"];
      if (privateRoutes.includes(pathname) && !token) {
        router.push("/login");
      }
    };

    initAuth();
  }, [router, pathname, loading]);

  const login = async (credentials: LoginCredentials) => {
    await api.login(credentials);
    const userData = await api.getMe();
    setUser(userData);
    router.push("/");
  };

  const register = async (data: RegisterPayload) => {
    await api.register(data);
    router.push("/login");
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    return defaultAuthContext;
  }
  return context;
}
