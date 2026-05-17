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
