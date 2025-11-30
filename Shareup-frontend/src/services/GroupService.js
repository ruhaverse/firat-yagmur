import axios from 'axios';
import AuthService from './auth.services';
import settings from "./Settings";
import logger from '../utils/logger';

const USER_API_BASE_URL =  `${settings.apiUrl}/api/v1/groups`
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
            const result = await authAxios.get('')
            return result;
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