export enum Role {
  SuperAdmin = 'SuperAdmin',
  PlatformStaff = 'PlatformStaff',
  ShopManager = 'ShopManager',
  Receptionist = 'Receptionist',
  Groomer = 'Groomer',
  Vet = 'Vet',
  PetOwner = 'PetOwner',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginRequest {
  Email: string;
  Password: string;
}

export interface AuthResponse {
  AccessToken?: string;
  RefreshToken?: string;
  RequiresTwoFactor?: boolean;
  accessToken?: string;
  refreshToken?: string;
  requiresTwoFactor?: boolean;
}

export interface TotpVerifyRequest {
  Email: string;
  Code: string;
}

