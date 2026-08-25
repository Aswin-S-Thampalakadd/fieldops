export interface User {
  _id: string;
  email: string;
  name: string;
  role: "ADMIN" | "TECHNICIAN";
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
