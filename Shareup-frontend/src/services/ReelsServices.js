import axios from 'axios';
import AuthService from './auth.services';
import settings from "./Settings";
import logger from '../utils/logger';

let authAxios = null;
const baseurl=`${settings.apiUrl}/api/v1/`
const authenticate = () => {
    if(AuthService.getCurrentUser()){
        authAxios = axios.create({
            baseURL: baseurl,
            headers: {
                
                Authorization: `Bearer ${AuthService.getCurrentUser().jwt}`
            }
        })
    }else{
        authAxios = axios.create({
            baseURL: baseurl,
        })
    }
}
authenticate();

class ReelsServices {
    
    createReels = async (userId, formdata) => {
        try {
            authenticate();
            // Legacy endpoints that encoded userId in the URL were removed on the server.
            // POST /api/v1/reels expects an authenticated request and derives the author from the JWT.
            const result = await authAxios.post(`/reels`, formdata);
            return result;
        } catch (error) {
            logger.error('ReelsServices.createReels failed:', error);
            throw error;
        }
    }

    getReelForUser = async (userId) => {
        try {
            authenticate();
            const result = await authAxios.get('/reels', {
                params: { userId },
            })
            return result;
        } catch (error) {
            logger.error('ReelsServices.getReelForUser failed:', error);
            throw error;
        }
    }

    getPreviewReel = async () => {
        try {
            authenticate();
            const result = await authAxios.get(`/last/reels`)
            return result;
        } catch (error) {
            logger.error('ReelsServices.getPreviewReel failed:', error);
            throw error;
        }
    }

    getAllReels = async () => {
        try {
            authenticate();
            const result = await authAxios.get(`reels`)
            return result;
        } catch (error) {
            logger.error('ReelsServices.getAllReels failed:', error);
            throw error;
        }
    }
}

export default new ReelsServices();