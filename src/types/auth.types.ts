export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  profileImageUrl?: string;
  bio?: string;
  website?: string;
}

export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}
