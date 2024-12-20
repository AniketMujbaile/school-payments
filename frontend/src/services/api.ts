import axios from 'axios';
import jwtDecode from 'jwt-decode';

// Base URL for API
const BASE_URL = 'https://dev-vanilla.edviron.com/erp';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// Authentication service
export const authService = {
  // Login function
  async login(credentials: { username: string; password: string }) {
    try {
      const response = await api.post('/login', credentials);
      const { token } = response.data;
      
      // Store token in local storage
      localStorage.setItem('authToken', token);
      
      return response.data;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  },

  // Check if token is valid
  isTokenValid(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    try {
      const decoded: { exp: number } = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  // Get current user
  getCurrentUser() {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('authToken');
  }
};

// Transactions service
export const transactionService = {
  // Fetch all transactions
  async getAllTransactions(page = 1, limit = 10, filters = {}) {
    try {
      const response = await api.get('/transactions', {
        params: { page, limit, ...filters },
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('authToken')}` 
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch transactions', error);
      throw error;
    }
  },

  // Fetch transactions by school
  async getTransactionsBySchool(schoolId: string, page = 1, limit = 10) {
    try {
      const response = await api.get(`/transactions/school/${schoolId}`, {
        params: { page, limit },
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('authToken')}` 
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch school transactions', error);
      throw error;
    }
  },

  // Check transaction status
  async checkTransactionStatus(customOrderId: string) {
    try {
      const response = await api.get(`/transactions/check-status/${customOrderId}`, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('authToken')}` 
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to check transaction status', error);
      throw error;
    }
  },

  // Create collect request
  async createCollectRequest(data: any) {
    try {
      const response = await api.post('/create-collect-request', data, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create collect request', error);
      throw error;
    }
  }
};

// School service
export const schoolService = {
  // Fetch list of schools
  async getSchools() {
    try {
      const response = await api.get('/schools', {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('authToken')}` 
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch schools', error);
      throw error;
    }
  }
};

export default api;