import axios from 'axios';
import AuthService from './auth.services';
import settings from "./Settings";
import logger from '../utils/logger';

let authAxios = null;
const baseurl=`${settings.apiUrl}/api/v1/`

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
            const key = 'swaps:all';
            const cached = getCached(key);
            if (cached) return { data: cached };
            if (_inFlight.has(key)) return _inFlight.get(key);

            const promise = authAxios
                .get('swaps/')
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
            const result = await authAxios.get(`swaps/friends/${email}`)
            return result;
        } catch (error) {
            logger.error('SwapService.getSwapForUserFriends failed:', error);
            throw error;
        }
    }

    getSavedSwapForUser = async (email) => {
        try {
            authenticate();
            // backend exposes authenticated user's saved swaps at GET /api/v1/swaps/saved
            const result = await authAxios.get(`swaps/saved`)
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