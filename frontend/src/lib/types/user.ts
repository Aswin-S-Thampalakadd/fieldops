export type Role = "ADMIN" | "TECHNICIAN";

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

export interface TechnicianResponse {
  id: string;
  email: string;
  name: string;
  role: "technician";
  isActive: boolean;
  initials?: string;
  jobs?: number;
  status?: "available" | "on-job" | "off-duty";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TechnicianListResponse {
  technicians: TechnicianResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface User {
  id?: string;
  email: string;
  passwordHash?: string;
  name: string;
  role: Role;
  isActive: boolean;
  refreshTokenHash?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
