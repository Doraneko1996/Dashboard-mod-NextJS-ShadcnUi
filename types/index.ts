import { Icons } from '@/components/icons';

export interface LoginCredentials {
  user_name: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  access_token?: string;
  refresh_token?: string;
}

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
  image: string | null;
  refresh_token: string | null;
  status: number;
  created_at: string;
  updated_at: string;
}

// Type cho icons
export type IconKeys = keyof typeof Icons;

// Interface cho navigation items
export interface NavItem {
  title: string;
  icon?: IconKeys;
  url: string;
  items?: NavItem[];
  isActive?: boolean;
}