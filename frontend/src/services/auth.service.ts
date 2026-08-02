import api from "../api/api";

import type {
  LoginData,
  RegisterData,
  AuthResponse,
} from "../types/auth.types";

export async function login(data: LoginData) {
  const response = await api.post<AuthResponse>(
    "/auth/login",
    data
  );

  return response.data;
}

export async function register(data: RegisterData) {
  const response = await api.post<AuthResponse>(
    "/auth/register",
    data
  );

  return response.data;
}