import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URLS } from '../config/apiConfig';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URLS.development;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor - add JWT token
    this.client.interceptors.request.use(
      async (config) => {
        try {
          const token = await AsyncStorage.getItem('jwt');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error getting token:', error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired
          await AsyncStorage.removeItem('jwt');
          await AsyncStorage.removeItem('user');
          // Trigger logout via app state
        }
        return Promise.reject(error);
      }
    );
  }

  setBaseURL(url) {
    this.baseURL = url;
    this.client.defaults.baseURL = url;
  }

  getBaseURL() {
    return this.baseURL;
  }

  get(endpoint, config = {}) {
    return this.client.get(endpoint, config);
  }

  post(endpoint, data = {}, config = {}) {
    return this.client.post(endpoint, data, config);
  }

  put(endpoint, data = {}, config = {}) {
    return this.client.put(endpoint, data, config);
  }

  patch(endpoint, data = {}, config = {}) {
    return this.client.patch(endpoint, data, config);
  }

  delete(endpoint, config = {}) {
    return this.client.delete(endpoint, config);
  }
}

export default new ApiClient();
