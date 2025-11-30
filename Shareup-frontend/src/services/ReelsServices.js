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
            const result = await authAxios.post(`/reels/web/${userId}`,formdata)
            return result
        } catch (error) {
            logger.error('ReelsServices.createReels failed:', error);
            throw error;
        }
    }

    getReelForUser = async (email) => {
        try {
            authenticate();
            const result = await authAxios.get(`reel/user/${email}`)
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