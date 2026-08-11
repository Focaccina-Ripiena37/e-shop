export interface User {
  id: number;
  email: string;
  admin: boolean;
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
  user: User;
  token: string;
}

export interface LoginRequest {
  user: {
    email: string;
    password: string;
  };
}
