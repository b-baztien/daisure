export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
  phone?: string;
}

export interface User {
  id: string;
  email?: string;
  lineUserId?: string;
  displayName: string;
  pictureUrl?: string;
  role: "buyer" | "seller" | "admin" | "super_admin";
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
