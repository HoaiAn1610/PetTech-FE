import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role, AuthState, LoginRequest, AuthResponse, TotpVerifyRequest } from '@/types/auth';
import { authService } from '@/api/services';

interface AuthContextType extends AuthState {
  login: (credentialsOrRole: LoginRequest | Role, isAdminFlow?: boolean) => Promise<AuthResponse | void>;
  verifyOtp: (payload: TotpVerifyRequest, isAdminFlow: boolean) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Custom JWT decoder to extract claims securely
 */
function decodeJwt(token: string): User | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);

    // Extract common JWT claims (checking both standard OIDC claims & C# identity claims)
    const id = payload.sub || payload.nameid || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '';
    const name = payload.unique_name || payload.name || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'PetTech User';
    const email = payload.email || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '';
    
    // Extract role
    let roleStr = payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '';
    if (Array.isArray(roleStr)) {
      roleStr = roleStr[0];
    }

    // Map claim string to Role enum
    let role: Role = Role.PetOwner;
    if (Object.values(Role).includes(roleStr as Role)) {
      role = roleStr as Role;
    } else {
      const upperRole = String(roleStr).toUpperCase();
      if (upperRole.includes('SUPERADMIN')) role = Role.SuperAdmin;
      else if (upperRole.includes('PLATFORMSTAFF')) role = Role.PlatformStaff;
      else if (upperRole.includes('SHOPMANAGER')) role = Role.ShopManager;
      else if (upperRole.includes('RECEPTIONIST')) role = Role.Receptionist;
      else if (upperRole.includes('GROOMER')) role = Role.Groomer;
      else if (upperRole.includes('VET')) role = Role.Vet;
      else role = Role.PetOwner;
    }

    return { id, name, email, role };
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
}

function normalizeAuthResponse(rawResponse: any): AuthResponse {
  if (!rawResponse || typeof rawResponse !== 'object') {
    return { AccessToken: '', RefreshToken: '', RequiresTwoFactor: false };
  }

  // Handle { isSuccess: true, value: { ... } } or { isSuccess: true, data: { ... } } wrapper
  let payload = rawResponse;
  if ('isSuccess' in rawResponse) {
    if ('value' in rawResponse && rawResponse.value !== undefined) {
      payload = rawResponse.value;
    } else if ('data' in rawResponse && rawResponse.data !== undefined) {
      payload = rawResponse.data;
    }
  }

  if (!payload || typeof payload !== 'object') {
    return { AccessToken: '', RefreshToken: '', RequiresTwoFactor: false };
  }

  return {
    AccessToken: payload.AccessToken || payload.accessToken || '',
    RefreshToken: payload.RefreshToken || payload.refreshToken || '',
    RequiresTwoFactor: !!(payload.RequiresTwoFactor || payload.requiresTwoFactor),
    accessToken: payload.AccessToken || payload.accessToken || '',
    refreshToken: payload.RefreshToken || payload.refreshToken || '',
    requiresTwoFactor: !!(payload.RequiresTwoFactor || payload.requiresTwoFactor),
  };
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const fetchUserProfile = async () => {
    try {
      const res = await authService.getProfile();
      const profile = res?.data || res;
      if (profile) {
        setState(prev => {
          if (!prev.user) return prev;
          const updatedUser = {
            ...prev.user,
            name: profile.displayName || profile.fullName || profile.name || prev.user.name,
            email: profile.email || prev.user.email
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          return {
            ...prev,
            user: updatedUser
          };
        });
      }
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };

  useEffect(() => {
    // Check for existing token and user on application load
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setState({
          user: parsedUser,
          isAuthenticated: true,
          isLoading: false,
        });
        
        // Fetch full profile in background to update any changes (like custom names)
        fetchUserProfile();
      } catch {
        // Clear corrupt state
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  /**
   * Dual Login function: supports both Mock demo login and production API login
   */
  const login = async (
    credentialsOrRole: LoginRequest | Role,
    isAdminFlow: boolean = false
  ): Promise<AuthResponse | void> => {
    // 1. Mock/Demo login flow (backward compatible with Landing Page quick demo roles)
    if (typeof credentialsOrRole === 'string' && Object.values(Role).includes(credentialsOrRole as Role)) {
      const role = credentialsOrRole as Role;
      const mockUser: User = {
        id: 'mock-id-' + Math.random().toString(36).substr(2, 9),
        name: `Demo ${role}`,
        email: `${role.toLowerCase()}@pettech.io`,
        role: role,
      };
      
      localStorage.setItem('token', 'mock-jwt-bearer-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });
      return {
        AccessToken: 'mock-jwt-bearer-token',
        RefreshToken: '',
        RequiresTwoFactor: false
      };
    }

    // 2. Production API Authentication
    const credentials = credentialsOrRole as LoginRequest;
    const rawResponse = isAdminFlow
      ? await authService.adminLogin(credentials)
      : await authService.login(credentials);

    const response = normalizeAuthResponse(rawResponse);

    // If API response requires 2FA, return early and do not update auth state yet
    if (response.RequiresTwoFactor) {
      return response;
    }

    // Success flow (No 2FA required): Store tokens and decode user profile
    const token = response.AccessToken || '';
    const rToken = response.RefreshToken || '';
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', rToken);

    const decodedUser = decodeJwt(token);
    const userProfile: User = decodedUser || {
      id: 'user-id',
      name: 'PetTech User',
      email: credentials.Email,
      role: isAdminFlow ? Role.SuperAdmin : Role.PetOwner,
    };

    localStorage.setItem('user', JSON.stringify(userProfile));
    setState({
      user: userProfile,
      isAuthenticated: true,
      isLoading: false,
    });

    fetchUserProfile();

    return response;
  };

  /**
   * Verification of Two-Factor Authentication code
   */
  const verifyOtp = async (payload: TotpVerifyRequest, isAdminFlow: boolean): Promise<AuthResponse> => {
    const rawResponse = isAdminFlow
      ? await authService.verifyAdminTotp(payload)
      : await authService.verifyTotp(payload);

    const response = normalizeAuthResponse(rawResponse);

    const token = response.AccessToken || '';
    const rToken = response.RefreshToken || '';
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', rToken);

    const decodedUser = decodeJwt(token);
    const userProfile: User = decodedUser || {
      id: 'user-id',
      name: 'PetTech User',
      email: payload.Email,
      role: isAdminFlow ? Role.SuperAdmin : Role.PetOwner,
    };

    localStorage.setItem('user', JSON.stringify(userProfile));
    setState({
      user: userProfile,
      isAuthenticated: true,
      isLoading: false,
    });

    fetchUserProfile();

    return response;
  };

  /**
   * Log out of the application and wipe local state/tokens
   */
  const logout = () => {
    authService.logout();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, verifyOtp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
