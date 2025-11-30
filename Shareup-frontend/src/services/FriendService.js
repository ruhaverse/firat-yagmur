import axios from 'axios';
import AuthService from './auth.services';
import settings from "./Settings";
import logger from '../utils/logger';

const USER_API_BASE_URL = `${settings.apiUrl}/api/v1/`
let authAxios = null;

const authenticate = () => {
    if(AuthService.getCurrentUser()){
        authAxios = axios.create({
            baseURL: USER_API_BASE_URL,
            headers: {
                'Authorization': `Bearer ${AuthService.getCurrentUser().jwt}`,
                'Access-Control-Allow-Origin': "*"
            }
        })
    }else{
        authAxios = axios.create({
            baseURL:  `${settings.apiUrl}/api/v1/`
        })
    }
}
authenticate()

class FriendService {
    getFriends = async (email) => {
        try {
            authenticate()
            const result = await authAxios.get(`/friends/email/${email}`)
            return result
        } catch (error) {
            logger.error('FriendService.getFriends failed:', error);
            throw error;
        }
    }

    addFriends = async (uid, fid) => {
        try {
            authenticate();
            const result = await authAxios.post(`/friends/${uid}/${fid}`)
            return result
        } catch (error) {
            logger.error('FriendService.addFriends failed:', error);
            throw error;
        }
    }

    removeFriends = async (uid, fid) => {
        try {
            authenticate();
            const result = await authAxios.delete(`/friends/${uid}/${fid}`)
            return result
        } catch (error) {
            logger.error('FriendService.removeFriends failed:', error);
            throw error;
        }
    }

    sendRequest = async (uid,fid) => {
        try {
            authenticate();
            const result = await authAxios.post(`/${uid}/friend_request/${fid}`)
            return result
        } catch (error) {
            logger.error('FriendService.sendRequest failed:', error);
            throw error;
        }
    }

    acceptRequest = async (uid, fid) => {
        try {
            authenticate();
            const result = await authAxios.post(`/${uid}/accept_friend_request/${fid}`)
            return result
        } catch (error) {
            logger.error('FriendService.acceptRequest failed:', error);
            throw error;
        }
    }

    declineRequest = async (uid, fid) => {
        try {
            authenticate();
            const result = await authAxios.post(`/${uid}/decline_friend_request/${fid}`)
            return result
        } catch (error) {
            logger.error('FriendService.declineRequest failed:', error);
            throw error;
        }
    }

    unsendRequest = async (uid, fid) => {
        try {
            authenticate();
            const result = await authAxios.post(`/${uid}/decline_friend_request/${fid}`)
            return result
        } catch (error) {
            logger.error('FriendService.unsendRequest failed:', error);
            throw error;
        }
    }
}

export default new FriendService();