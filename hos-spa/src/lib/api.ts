import axios from "axios";
import { AxiosError } from "axios";

// API client with session management
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Key for storing the session token in local storage
const SESSION_TOKEN_KEY = 'sessionToken';
const VENDOR_ID_KEY = 'vendorId';

// Function to get the current session token
export function getSessionToken(): string | null {
  return localStorage.getItem(SESSION_TOKEN_KEY);
}

// Function to get the current vendor ID
export function getVendorId(): string | null {
  return localStorage.getItem(VENDOR_ID_KEY);
}

// Function to set the session token
function setSessionToken(token: string | null) {
  if (token) {
    localStorage.setItem(SESSION_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(SESSION_TOKEN_KEY);
  }
}

function setVendorId(vendorId: string | null) {
  if (vendorId) {
    localStorage.setItem(VENDOR_ID_KEY, vendorId);
  } else {
    localStorage.removeItem(VENDOR_ID_KEY);
  }
}

// Axios request interceptor to add the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = getSessionToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios response interceptor for global error handling (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle 401 Unauthorized: clear token and potentially redirect to login
      console.error('Authentication failed or token expired. Logging out.');
      logout(); // Clear the token
      // Optionally: redirect to login page
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Vendor-specific login function
export async function loginVendor(vendorId: string, username: string, password: string) {
  const response = await api.post('/auth/login', { vendorId, username, password });
  const responseData = response.data;
  setSessionToken(responseData.sessionToken);
  setVendorId(responseData.vendorId); // Use vendorId from the API response
  return responseData; // { sessionToken, vendorId }
}

// Simple API functions
export const apiClient = {
  get: (path: string) => {
    return api.get(path);
  },
  post: (path: string, data: unknown) => {
    return api.post(path, data);
  }
};

export function logout() {
  const token = getSessionToken();
  if (token) {
    // Optionally send logout request to invalidate server-side session
    api.post('/auth/logout', { sessionToken: token }).catch(err => {
      console.error('Error during server-side logout:', err);
    });
  }
  setSessionToken(null); // Clear token from local storage
  setVendorId(null);
}

// Function to initialize the Authorization header from localStorage.
// This should be called once when the application loads.
export function initializeAuthToken() {
  const token = getSessionToken();
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}
