export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;

  user: {
    id: number;
    fullName: string;
    email: string;
    role: string;
  };
}