export interface User {
  id: number;
  user_name: string;
  role: number;
  first_name: string;
  last_name: string;
  gender: number | null;
  dob: string;
  phone_number: string | null;
  email: string | null;
  address: string | null;
  district: string | null;
  province: string | null;
  refresh_token: string | null;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  user_name: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
  error?: string;
}