export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;

  data: {
    token: string;
    user: AuthUser;
  };
}