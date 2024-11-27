export interface LoginCredentials {
  user_name: string;
  password: string;
}

export interface User {
  id: number;
  user_name: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  status: number;
  role: number;
  gender?: string;
  dob?: string;
  address?: string;
  district?: string;
  province?: string;
}

export interface AuthResponse {
  success?: boolean;
  user?: User;
  message?: string;
  error?: string;
  access_token?: string;
  refresh_token?: string;
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  gender?: string;
  dob?: string;
  address?: string;
  district?: string;
  province?: string;
}