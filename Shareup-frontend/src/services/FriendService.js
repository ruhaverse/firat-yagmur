import axios from 'axios';
import AuthService from './auth.services';
import settings from "./Settings";
import logger from '../utils/logger';

const USER_API_BASE_URL = `${settings.apiUrl}/api/v1/`
let authAxios = null;

const _inFlight = new Map();
const _cache = new Map();
const CACHE_TTL_MS = 5000;

const getCached = (key) => {
    const entry = _cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.ts > CACHE_TTL_MS) {
        _cache.delete(key);
        return null;
    }
    return entry.value;
}

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
            const key = `friends:${email || ''}`;
            const cached = getCached(key);
            if (cached) return { data: cached };
            if (_inFlight.has(key)) return _inFlight.get(key);

            const encoded = encodeURIComponent(email);
            const promise = authAxios
                .get(`/friends/email/${encoded}`)
                .then((res) => {
                    _cache.set(key, { ts: Date.now(), value: res.data });
                    return res;
                })
                .catch((error) => {
                    const status = error?.response?.status;
                    if (status === 404 || status === 429) {
                        const cached2 = getCached(key);
                        return { data: cached2 || [] };
                    }
                    throw error;
                })
                .finally(() => {
                    _inFlight.delete(key);
                });

            _inFlight.set(key, promise);
            return await promise;
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
            const result = await authAxios.post(`/friends/${uid}/friend_request/${fid}`)
            return result
        } catch (error) {
            logger.error('FriendService.sendRequest failed:', error);
            throw error;
        }
    }

    acceptRequest = async (uid, fid) => {
        try {
            authenticate();
            const result = await authAxios.post(`/friends/${uid}/accept_friend_request/${fid}`)
            return result
        } catch (error) {
            logger.error('FriendService.acceptRequest failed:', error);
            throw error;
        }
    }

    declineRequest = async (uid, fid) => {
        try {
            authenticate();
            const result = await authAxios.post(`/friends/${uid}/decline_friend_request/${fid}`)
            return result
        } catch (error) {
            logger.error('FriendService.declineRequest failed:', error);
            throw error;
        }
    }

    unsendRequest = async (uid, fid) => {
        try {
            authenticate();
            const result = await authAxios.post(`/friends/${uid}/decline_friend_request/${fid}`)
            return result
        } catch (error) {
            logger.error('FriendService.unsendRequest failed:', error);
            throw error;
        }
    }
}

export default new FriendService();