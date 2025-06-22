import axios from "axios";

// API client with session management
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  headers: {
    "Content-Type": "application/json"
  }
});

// Session storage
let sessionToken: string | null = null;

// Vendor-specific login function
export async function loginVendor(vendorId: string, username: string, password: string) {
  const response = await api.post('/auth/login', { vendorId, username, password });
  sessionToken = response.data.sessionToken;
  
  // Add session token to all future requests
  api.defaults.headers.common['Authorization'] = `Bearer ${sessionToken}`;
  
  return response.data; // { sessionToken, vendorId }
}

// Simple API functions
export const apiClient = {
  get: (path: string) => {
    if (!sessionToken) {
      throw new Error('Not authenticated. Call loginVendor() first.');
    }
    return api.get(path);
  },
  post: (path: string, data: any) => {
    if (!sessionToken) {
      throw new Error('Not authenticated. Call loginVendor() first.');
    }
    return api.post(path, data);
  }
};

export function logout() {
  if (sessionToken) {
    api.post('/auth/logout', { sessionToken });
    sessionToken = null;
    delete api.defaults.headers.common['Authorization'];
  }
}
