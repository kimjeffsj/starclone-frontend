import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
} from "@/types/auth.types";
import axios from "axios";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userDate: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

// API setting
const API_URL = import.meta.env.VITE_API_URL;

// axios setting
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem("token"),
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("token"),

  // Login
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      set({ user, token, isLoading: false, isAuthenticated: true });
    } catch (error: any) {
      console.error("Login error:", error);
      set({
        isLoading: false,
        error:
          error.response?.data?.message || "Login failed. Please try again.",
      });
      throw error;
    }
  },

  register: async (userData: RegisterData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<AuthResponse>("/auth/register", userData);
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      set({ user, token, isLoading: false, isAuthenticated: true });
    } catch (error: any) {
      console.error("Registration error:", error);
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("token");
      set({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error("Logout error:", error);

      localStorage.removeItem("token");
      set({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ isAuthenticated: false });
      return;
    }

    set({ isLoading: true });
    try {
      const response = await api.get<AuthResponse>("/auth/me");
      set({
        user: response.data.user,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Auth check error:", error);
      localStorage.removeItem("token");
      set({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
