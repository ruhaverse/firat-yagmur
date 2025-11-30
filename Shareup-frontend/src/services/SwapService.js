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

class SwapService {
    getSwap = async () => {
        try {
            authenticate();
            const result = await authAxios.get('swaps/')
            return result;
        } catch (error) {
            logger.error('SwapService.getSwap failed:', error);
            throw error;
        }
    }

    getSwapForUser = async (email) => {
        try {
            authenticate();
            const result = await authAxios.get(`swaps/email/${email}`)
            return result;
        } catch (error) {
            logger.error('SwapService.getSwapForUser failed:', error);
            throw error;
        }
    }

    getSwapForUserFriends = async (email) => {
        try {
            authenticate();
            const result = await authAxios.get(`swaps/femail/${email}`)
            return result;
        } catch (error) {
            logger.error('SwapService.getSwapForUserFriends failed:', error);
            throw error;
        }
    }

    getSavedSwapForUser = async (email) => {
        try {
            authenticate();
            const result = await authAxios.get(`swaps/${email}/saved_swaps`)
            return result;
        } catch (error) {
            logger.error('SwapService.getSavedSwapForUser failed:', error);
            throw error;
        }
    }

    createSwap = async (userId, formdata) => {
        try {
            authenticate();
            const result = await authAxios.post(`swaps/${userId}`,formdata)
            return result
        } catch (error) {
            logger.error('SwapService.createSwap failed:', error);
            throw error;
        }
    }

    updateSwap = async (swapId, swap) => {
        try {
            authenticate();
            const result = await authAxios.put(`swaps/${swapId}`, swap)
            return result;
        } catch (error) {
            logger.error('SwapService.updateSwap failed:', error);
            throw error;
        }
    }

    deleteSwap = async (swapid) => {
        try {
            authenticate();
            const result = await authAxios.delete(`swaps/${swapid}`)
            return result
        } catch (error) {
            logger.error('SwapService.deleteSwap failed:', error);
            throw error;
        }
    }

    addComment = async (userid, swapid, comment) => {
        try {
            authenticate();
            const result = await authAxios.post(`comment/${userid}/${swapid}`, comment)
            return result
        } catch (error) {
            logger.error('SwapService.addComment failed:', error);
            throw error;
        }
    }

    deleteComment = async (commentid) => {
        try {
            const result = await authAxios.delete(`comment/${commentid}`)
            return result
        } catch (error) {
            logger.error('SwapService.deleteComment failed:', error);
            throw error;
        }
    }
}

export default new SwapService();