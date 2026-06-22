import { create } from 'zustand';
import { apiFetch } from '../api/fetch';

interface User {
  id: number;
  full_name: string;
  press_name: string;
  initial: string;
  email: string;
  phone: string;
  business_type: string;
}

interface AuthStore {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
}