import { createContext, useContext, useState, type ReactNode } from 'react';
import { loginVendor, logout } from '../lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  vendorId: string;
  login: (vendorId: string, username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [vendorId, setVendorId] = useState('');

  const login = async (vendor: string, username: string, password: string) => {
    await loginVendor(vendor, username, password);
    setVendorId(vendor);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setVendorId('');
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      vendorId,
      login,
      logout: handleLogout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}