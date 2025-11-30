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

class ShareService {
    getShare = async () => {
        try {
            authenticate();
            const result = await authAxios.get('/share')
            return result;
        } catch (error) {
            logger.error('ShareService.getShare failed:', error);
            throw error;
        }
    }

    getShareForUser = async (email) => {
        try {
            authenticate();
            const result = await authAxios.get(`share/email/${email}`)
            return result;
        } catch (error) {
            logger.error('ShareService.getShareForUser failed:', error);
            throw error;
        }
    }

    getSavedShareForUser = async (email) => {
        try {
            authenticate();
            const result = await authAxios.get(`share/${email}/saved_share`)
            return result;
        } catch (error) {
            logger.error('ShareService.getSavedShareForUser failed:', error);
            throw error;
        }
    }

    createShare = async (userId,postid, formdata) => {
        try {
            authenticate();
            const result = await authAxios.post(`share/${userId}/${postid}`,formdata)
            return result
        } catch (error) {
            logger.error('ShareService.createShare failed:', error);
            throw error;
        }
    }
}

export default new ShareService();