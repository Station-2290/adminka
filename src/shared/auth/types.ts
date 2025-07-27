export interface User {
  id: number;
  email: string;
  username: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'CUSTOMER';
  is_active: boolean;
  customer_id?: number | null;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  login: string; // email or username
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token_expires_at: string;
  user: User;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token_expires_at: string;
  user: User;
}