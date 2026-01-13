import apiClient from './apiClient';
import { AUTH_ENDPOINTS } from '../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthService {
  /**
   * Register new user
   */
  async register(email, password, firstName, lastName) {
    try {
      const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER, {
        email,
        password,
        firstName,
        lastName,
      });

      if (response.data?.data?.token) {
        const { token, user } = response.data.data;
        await this.saveAuthData(token, user);
      }

      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(email, password) {
    try {
      const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, {
        email,
        password,
      });

      if (response.data?.data?.token) {
        const { token, user } = response.data.data;
        await this.saveAuthData(token, user);
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout API error (continuing):', error);
    }

    // Always clear local storage
    await AsyncStorage.removeItem('jwt');
    await AsyncStorage.removeItem('user');
    return true;
  }

  /**
   * Refresh JWT token
   */
  async refreshToken() {
    try {
      const response = await apiClient.post(AUTH_ENDPOINTS.REFRESH);
      if (response.data?.data?.token) {
        await AsyncStorage.setItem('jwt', response.data.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Get current user from storage
   */
  async getCurrentUser() {
    try {
      const user = await AsyncStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated() {
    try {
      const token = await AsyncStorage.getItem('jwt');
      return !!token;
    } catch (error) {
      return false;
    }
  }

  /**
   * Save auth data to storage
   */
  async saveAuthData(token, user) {
    try {
      await AsyncStorage.setItem('jwt', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving auth data:', error);
      throw error;
    }
  }

  /**
   * Clear all auth data
   */
  async clearAuthData() {
    try {
      await AsyncStorage.removeItem('jwt');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }
