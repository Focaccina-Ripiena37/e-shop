export interface User {
  id: number;
  email: string;
  admin: boolean;
  active?: boolean;
  role?: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  gender?: string;
  street?: string;
  city?: string;
  zip?: string;
  country?: string;
}

export interface AuthResponse {
  message?: string;
  user: User;
  token: string;
}

export interface LoginRequest {
  user: {
    email: string;
    password: string;
  };
}

export interface SignupRequest {
  user: {
    email: string;
    password: string;
    password_confirmation: string;
  };
}
