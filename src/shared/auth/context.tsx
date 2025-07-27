import {  createContext, useContext, useEffect, useReducer } from 'react';
import { tokenStorage } from './storage';
import type {ReactNode} from 'react';
import type { AuthState, LoginCredentials, User } from './types';
import { fetchClient } from '@/shared/api';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TOKEN'; payload: string | null }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload,
        isAuthenticated: !!action.payload 
      };
    case 'SET_TOKEN':
      return { ...state, accessToken: action.payload };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        accessToken: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const setToken = (token: string | null) => {
    if (token) {
      tokenStorage.setAccessToken(token);
    } else {
      tokenStorage.removeAccessToken();
    }
    dispatch({ type: 'SET_TOKEN', payload: token });
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetchClient.POST('/api/auth/login', {
        body: {
          username: credentials.login,
          password: credentials.password,
        },
      });

      if (response.error) {
        throw new Error('Login failed');
      }

      const loginData = response.data;
      setToken(loginData.access_token);
      dispatch({ type: 'SET_USER', payload: loginData.user });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async () => {
    try {
      await fetchClient.POST('/api/auth/logout', {});
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
      tokenStorage.clear();
    }
  };

  const refreshToken = async () => {
    try {
      const response = await fetchClient.POST('/api/auth/refresh', {});
      
      if (response.error) {
        throw new Error('Failed to refresh token');
      }

      const refreshData = response.data;
      setToken(refreshData.access_token);
      dispatch({ type: 'SET_USER', payload: refreshData.user });
    } catch (error) {
      console.error('Token refresh failed:', error);
      dispatch({ type: 'LOGOUT' });
      tokenStorage.clear();
      throw error;
    }
  };

  const getCurrentUser = async () => {
    try {
      const token = tokenStorage.getAccessToken();
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      setToken(token);
      
      const response = await fetchClient.POST('/api/auth/me', {});
      
      if (response.error) {
        throw new Error('Failed to get user data');
      }

      const userData = response.data;
      // @ts-expect-error - todo: fix this
      dispatch({ type: 'SET_USER', payload: userData });
    } catch (error) {
      console.error('Get current user failed:', error);
      tokenStorage.clear();
      dispatch({ type: 'LOGOUT' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    getCurrentUser();

    // Listen for token refresh events from API client
    const handleTokenRefreshed = (event: CustomEvent) => {
      const { user, access_token } = event.detail;
      setToken(access_token);
      if (user) {
        dispatch({ type: 'SET_USER', payload: user });
      }
    };

    // Listen for logout events from API client
    const handleLogout = () => {
      dispatch({ type: 'LOGOUT' });
      tokenStorage.clear();
    };

    window.addEventListener('auth:token-refreshed', handleTokenRefreshed as EventListener);
    window.addEventListener('auth:logout', handleLogout);

    return () => {
      window.removeEventListener('auth:token-refreshed', handleTokenRefreshed as EventListener);
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}