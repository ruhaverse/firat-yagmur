import axios from 'axios';
import AuthService from './auth.services';
import settings from "./Settings";
import logger from '../utils/logger';

const USER_API_BASE_URL =  `${settings.apiUrl}/api/v1/groups`
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
            baseURL: USER_API_BASE_URL
        })
    }
}
authenticate();

class GroupService {
    createGroup = async (uid, formdata) => {
        try {
            authenticate();
            const result = await authAxios.post(`/${uid}/create`,formdata)
            return result;
        } catch (error) {
            logger.error('GroupService.createGroup failed:', error);
            throw error;
        }
    }

    getAllGroups = async () => {
        try {
            authenticate();
            const key = 'groups:all';
            const cached = getCached(key);
            if (cached) return { data: cached };
            if (_inFlight.has(key)) return _inFlight.get(key);

            const promise = authAxios
                .get('')
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
            logger.error('GroupService.getAllGroups failed:', error);
            throw error;
        }
    }

    getGroupById = async (id) => {
        try {
            authenticate();
            const result = await authAxios.get(`/id/${id}`)
            return result;
        } catch (error) {
            logger.error('GroupService.getGroupById failed:', error);
            throw error;
        }
    }

    getGroupByCurrentUser = async (email) => {
        try {
            authenticate();
            const result = await authAxios.get(`/email/${email}`)
            return result;
        } catch (error) {
            logger.error('GroupService.getGroupByCurrentUser failed:', error);
            throw error;
        }
    }

    getGroupsPostsById = async (id) => {
        try {
            authenticate();
            const result = await authAxios.get(`/posts/${id}`)
            return result;
        } catch (error) {
            logger.error('GroupService.getGroupsPostsById failed:', error);
            throw error;
        }
    }

    joinGroup = async (uid, gid) => {
        try {
            authenticate();
            const result = await authAxios.post(`/${uid}/join/${gid}`)
            return result
        } catch (error) {
            logger.error('GroupService.joinGroup failed:', error);
            throw error;
        }
    }

    leaveGroup = async (uid, gid) => {
        try {
            authenticate();
            const result = await authAxios.delete(`/${uid}/leave/${gid}`)
            return result
        } catch (error) {
            logger.error('GroupService.leaveGroup failed:', error);
            throw error;
        }
    }
}

export default new GroupService();