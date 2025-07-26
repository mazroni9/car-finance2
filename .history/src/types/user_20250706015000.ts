export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'dealer' | 'user';
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  user_id: string;
  phone?: string;
  address?: string;
  company_name?: string;
  company_cr?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
} 