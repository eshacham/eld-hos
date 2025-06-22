import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { loginVendor, logout, initializeAuthToken, getSessionToken, getVendorId } from '../lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  vendorId: string;
  login: (vendorId: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  isInitializing: boolean; // For the initial app load check
  isLoggingIn: boolean; // For the login action
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [vendorId, setVendorId] = useState(''); // Initialize with empty string
  const [isInitializing, setIsInitializing] = useState(true); // For initial page load
  const [isLoggingIn, setIsLoggingIn] = useState(false); // For login button state

  // Effect to check for token on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsInitializing(true);
      initializeAuthToken(); // Set Axios default header from localStorage
      const token = getSessionToken(); // Check if token exists

      if (token) {
        setIsAuthenticated(true);
        
        // Restore the vendorId from localStorage
        const storedVendorId = getVendorId();
        if (storedVendorId) setVendorId(storedVendorId);
      } else {
        setIsAuthenticated(false);
        setVendorId(''); // Ensure vendorId is cleared if no token
      }
      setIsInitializing(false);
    };

    checkAuthStatus();
  }, []); // Empty dependency array means this runs once on mount

  const login = async (vendor: string, username: string, password: string) => {
    setIsLoggingIn(true);
    try {
      const responseData = await loginVendor(vendor, username, password);
      setVendorId(responseData.vendorId); // Use vendorId from the API response
      setIsAuthenticated(true);
    } catch (error) {
      // Re-throw the error so the form can catch it and display a message
      throw error;
    } finally {
      // This will run whether the login succeeds or fails
      setIsLoggingIn(false);
    }
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
      logout: handleLogout,
      isInitializing,
      isLoggingIn
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