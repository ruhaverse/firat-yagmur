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

class StoriesService {
    getStories = async () => {
        try {
            authenticate();
            const result = await authAxios.get('stories/')
            return result;
        } catch (error) {
            logger.error('StoriesService.getStories failed:', error);
            throw error;
        }
    }
    
    getStoriesForUser = async (email) => {
        try {
            authenticate();
            const result = await authAxios.get(`stories/${email}`)
            return result;
        } catch (error) {
            logger.error('StoriesService.getStoriesForUser failed:', error);
            throw error;
        }
    }

    createStories = async (userId, formdata) => {
        try {
            authenticate();
            const result = await authAxios.post(`Stories/${userId}`,formdata)
            return result
        } catch (error) {
            logger.error('StoriesService.createStories failed:', error);
            throw error;
        }
    }
    
    updateStories = async (storiesId, stories) => {
        try {
            authenticate();
            const result = await authAxios.put(`stories/${storiesId}`, stories)
            return result;
        } catch (error) {
            logger.error('StoriesService.updateStories failed:', error);
            throw error;
        }
    }
}

export default new StoriesService();