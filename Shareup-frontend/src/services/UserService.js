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
            // Backend expects POST /api/v1/users/register
            const result = await axios.post(`${my_api}/api/v1/users/register`, user);
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
            // Normalize email: remove leading ':' or fallback to stored user email
            let emailToUse = email;
            if (emailToUse && typeof emailToUse === 'string' && emailToUse.startsWith(':')) {
                emailToUse = emailToUse.slice(1);
            }
            // If still missing or doesn't look like an email, try the authenticated user's stored email
            if (!emailToUse || (typeof emailToUse === 'string' && emailToUse.indexOf('@') === -1)) {
                const cu = AuthService.getCurrentUser();
                if (cu && cu.user && cu.user.email) {
                    emailToUse = cu.user.email;
                }
            }
            if (!emailToUse) {
                throw new Error('No valid email available to fetch user');
            }
            const result = await authAxios.get(`users/${encodeURIComponent(emailToUse)}`)
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
            authenticate();
            const encoded = encodeURIComponent(email);
            const result = await authAxios.get(`users/${encoded}/followers`)
            return result
        } catch (error) {
            logger.error('UserService.getFollowers failed:', error);
            throw error;
        }
    }

    getFollowing = async (email) => {
        try {
            authenticate();
            const encoded = encodeURIComponent(email);
            const result = await authAxios.get(`users/${encoded}/following`)
            return result
        } catch (error) {
            logger.error('UserService.getFollowing failed:', error);
            throw error;
        }
    }

    getFriendRequestSent = async (email) => {
        try {
            authenticate();
            const encoded = encodeURIComponent(email);

            // Try a few common endpoint patterns; treat 404 as "not supported".
            const tryPaths = [
                // New backend friends endpoints
                `friends/email/${encoded}/requests_sent`,
                `friends/email/${encoded}/requestsSent`,
                // Legacy/alternate patterns
                `users/${encoded}/friend_request_sent`,
                `${encoded}/friend_request_sent`,
            ];

            for (const path of tryPaths) {
                try {
                    return await authAxios.get(path);
                } catch (error) {
                    if (error?.response?.status === 404) continue;
                    throw error;
                }
            }

            return { data: [] };
        } catch (error) {
            logger.error('UserService.getFriendRequestSent failed:', error);
            throw error;
        }
    }

    getFriendRequestRecieved = async (email) => {
        try {
            authenticate();
            const encoded = encodeURIComponent(email);

            // Some backends spell "received" correctly; legacy code uses "recieved".
            const tryPaths = [
                // New backend friends endpoints
                `friends/email/${encoded}/requests_received`,
                `friends/email/${encoded}/requests_recieved`,
                // Legacy/alternate patterns
                `users/${encoded}/friend_request_received`,
                `users/${encoded}/friend_request_recieved`,
                `${encoded}/friend_request_received`,
                `${encoded}/friend_request_recieved`,
            ];

            for (const path of tryPaths) {
                try {
                    return await authAxios.get(path);
                } catch (error) {
                    if (error?.response?.status === 404) continue;
                    throw error;
                }
            }

            return { data: [] };
        } catch (error) {
            logger.error('UserService.getFriendRequestRecieved failed:', error);
            throw error;
        }
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