/**
 * API Client for Mobile App
 * Handles all HTTP requests to backend
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEnvironment, API_ENDPOINTS } from '../config/api';

class ApiClient {
  constructor() {
    const { apiUrl, apiBase } = getEnvironment();
    
    this.instance = axios.create({
      baseURL: `${apiUrl}${apiBase}`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add JWT token to every request
    this.instance.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('jwt_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle errors
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired - clear storage
          await AsyncStorage.removeItem('jwt_token');
          // Redirect to login
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  register(email, password, username) {
    return this.instance.post(API_ENDPOINTS.AUTH.REGISTER, {
      email,
      password,
      username,
    });
  }

  login(email, password) {
    return this.instance.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
  }

  // Posts
  getFeed(page = 1, limit = 10) {
    return this.instance.get(API_ENDPOINTS.POSTS.FEED, {
      params: { page, limit },
    });
  }

  createPost(data) {
    return this.instance.post(API_ENDPOINTS.POSTS.CREATE, data);
  }

  likePost(postId) {
    return this.instance.post(API_ENDPOINTS.POSTS.LIKE(postId));
  }

  // Messages
  getConversations() {
    return this.instance.get(API_ENDPOINTS.MESSAGES.CONVERSATIONS);
  }

  sendMessage(conversationId, message) {
    return this.instance.post(API_ENDPOINTS.MESSAGES.SEND, {
      conversationId,
      message,
    });
  }

  // Notifications
  getNotifications() {
    return this.instance.get(API_ENDPOINTS.NOTIFICATIONS.FETCH);
  }

  // Generic methods
  get(url, config) {
    return this.instance.get(url, config);
  }

  post(url, data, config) {
    return this.instance.post(url, data, config);
  }

  put(url, data, config) {
    return this.instance.put(url, data, config);
  }

  delete(url, config) {
    return this.instance.delete(url, config);
  }
}

export default new ApiClient();
