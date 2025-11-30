import axios from 'axios';
import authHeader from './auth-header';
import settings from './Settings';
import logger from '../utils/logger';

const USER_API_BASE_URL = `${settings.apiUrl}/api/v1/test`;

class UserService {
    getPublicContent() {
        try {
            return axios.get(USER_API_BASE_URL + 'all')
        } catch (error) {
            logger.error('UserService.getPublicContent failed:', error);
            throw error;
        }
    }

    getUserBoard() {
        try {
            return axios.get(USER_API_BASE_URL + 'user', {headers: authHeader()});
        } catch (error) {
            logger.error('UserService.getUserBoard failed:', error);
            throw error;
        }
    }

    getModeratorBoard() {
        try {
            return axios.get(USER_API_BASE_URL + 'mod', {headers: authHeader()});
        } catch (error) {
            logger.error('UserService.getModeratorBoard failed:', error);
            throw error;
        }
    }

    getAdminBoard() {
        try {
            return axios.get(USER_API_BASE_URL + 'admin', {headers: authHeader()});
        } catch (error) {
            logger.error('UserService.getAdminBoard failed:', error);
            throw error;
        }
    }
}

export default new UserService();
