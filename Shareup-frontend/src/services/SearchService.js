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
            baseURL: baseurl
        })
    }
}
authenticate();

class SearchService {
    getSearchbyuser = async (keyword) => {
        try {
            authenticate();
            const result = await authAxios.get(`/search/user?keyword=${keyword}`)
            return result;
        } catch (error) {
            logger.error('SearchService.getSearchbyuser failed:', error);
            throw error;
        }
    }

    getSearchbyPost = async (keyword) => {
        try {
            authenticate();
            const result = await authAxios.get(`/search/post?keyword=${keyword}`)
            return result;
        } catch (error) {
            logger.error('SearchService.getSearchbyPost failed:', error);
            throw error;
        }
    }

    getSearchbyGroup = async (keyword) => {
        try {
            authenticate();
            const result = await authAxios.get(`/search/group?keyword=${keyword}`)
            return result;
        } catch (error) {
            logger.error('SearchService.getSearchbyGroup failed:', error);
            throw error;
        }
    }
}

export default new SearchService();