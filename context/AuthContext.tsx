"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
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

  useEffect(() => {
    // Attempt to load user from token on mount
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          // Here you might want an endpoint like /api/me to get user details
          // Since it doesn't exist yet, we'll just assume user is logged in
          // if token is present.
          // For now, let's keep it simple.
          setUser({ _id: "1", email: "user@example.com", role: "user" } as User);
        }
      } catch (error) {
        console.error("Auth init failed", error);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (credentials: any) => {
    const data = await api.login(credentials);
    // Ideally the backend returns user object too
    setUser({ _id: "1", email: credentials.email, role: "user" } as User);
    router.push("/");
  };

  const register = async (data: any) => {
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
