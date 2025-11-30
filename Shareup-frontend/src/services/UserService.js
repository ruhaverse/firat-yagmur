import axios from 'axios';
import AuthService from './auth.services';
import settings from "./Settings";
import logger from '../utils/logger';

const my_api = `${settings.apiUrl}`
let authAxios = null;

const authenticate = () => {
    if(AuthService.getCurrentUser()){
        authAxios = axios.create({
            baseURL: `${my_api}/api/v1/`,
            headers: {
                'Authorization': `Bearer ${AuthService.getCurrentUser().jwt}`,
                'Access-Control-Allow-Origin': "*"
            }
        })
    }else{
        authAxios = axios.create({
            baseURL: `${my_api}/api/v1/`
        })
    }
}
authenticate();

class UserService {
    getUsers = async () => {
        try {
            const result = await authAxios.get('users/')
            return result;
        } catch (error) {
            logger.error('UserService.getUsers failed:', error);
            throw error;
        }
    }

    createUser = async (user) => {
        try {
            authenticate();
            const result = await axios.post(`${my_api}/api/v1/users/`, user)
            return result;
        } catch (error) {
            logger.error('UserService.createUser failed:', error);
            throw error;
        }
    }

    editProfile = async (email, user) => {
        try {
            authenticate();
            const result = await authAxios.put(`users/${email}/edit_profile`,user)
            return result
        } catch (error) {
            logger.error('UserService.editProfile failed:', error);
            throw error;
        }
    }

    // handleLogin = async (user) => {
    //     const result = await authAxios.post
    //     return axios.post(USER_API_BASE_URL+'/authenticate', user , {withCredentials: true})
    // }

    getUserByEmail = async (email) => {
        try {
            authenticate();
            const result = await authAxios.get(`users/${email}`)
            return result;
        } catch (error) {
            logger.error('UserService.getUserByEmail failed:', error);
            throw error;
        }
    }

    // addFriends = asyny (uid, fid) => {

    // }

    getFriends = async (email) => {
        try {
            authenticate();
            const result = await authAxios.get(`/friends/${email}`)
            return result
        } catch (error) {
            logger.error('UserService.getFriends failed:', error);
            throw error;
        }
    }

    getFollowers = async (email) => {
        try {
            const result = await authAxios.get(`${email}/followers`)
            return result
        } catch (error) {
            logger.error('UserService.getFollowers failed:', error);
            throw error;
        }
    }

    getFollowing = async (email) => {
        try {
            const result = await authAxios.get(`${email}/following`)
            return result
        } catch (error) {
            logger.error('UserService.getFollowing failed:', error);
            throw error;
        }
    }

    getFriendRequestSent = async (email) => {
        const result = await authAxios.get(`${email}/friend_request_sent`)
        return result
    }

    getFriendRequestRecieved = async (email) => {
        const result = await authAxios.get(`${email}/friend_request_recieved`)
        return result
    }

    follow = async (email,followed_id) => {
        try {
            authenticate();
            const result = await authAxios.post(`${email}/follows/${followed_id}`)
            return result
        } catch (error) {
            logger.error('UserService.follow failed:', error);
            throw error;
        }
    }

    unfollow = async (email,followed_id) => {
        try {
            authenticate();
            const result = await authAxios.delete(`${email}/unfollow/${followed_id}`)
            return result
        } catch (error) {
            logger.error('UserService.unfollow failed:', error);
            throw error;
        }
    }

    uploadProfilePicture = async (email, formdata) => {
        try {
            authenticate();
            const result = await authAxios.post(`users/${email}/upload_profile_picture`,formdata)
            return result
        } catch (error) {
            logger.error('UserService.uploadProfilePicture failed:', error);
            throw error;
        }
    }

    uploadCoverPicture = async (email, formdata) => {
        try {
            authenticate();
            const result = await authAxios.post(`users/${email}/upload_cover_picture`,formdata)
            return result
        } catch (error) {
            logger.error('UserService.uploadCoverPicture failed:', error);
            throw error;
        }
    }

    likePost = async (uid,pid) => {
        try {
            authenticate();
            const result = await authAxios.put(`/posts/${uid}/like-unlike/${pid}`,{emoji:"like"})
            return result
        } catch (error) {
            logger.error('UserService.likePost failed:', error);
            throw error;
        }
    }

    savePost = async (uid,pid) => {
        try {
            authenticate();
            const result = await authAxios.put(`/posts/${uid}/save-unsave/${pid}`)
            return result
        } catch (error) {
            logger.error('UserService.savePost failed:', error);
            throw error;
        }
    }
    
    likeSwap = async (uid,sid) => {
        try {
            authenticate();
            const result = await authAxios.put(`/swaps/${uid}/like-unlike/${sid}`,{emoji:"like"})
            return result
        } catch (error) {
            logger.error('UserService.likeSwap failed:', error);
            throw error;
        }
    }

    // saveSwap = async (uid,sid) => {
    //     const result = await authAxios.put(`/swaps/${uid}/save-unsave/${sid}`)
    //     return result
    // }
    
}

export default new UserService();