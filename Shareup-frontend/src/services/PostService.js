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

class PostService {
    getPost = async () => {
        try {
            authenticate();
            const result = await authAxios.get('posts/')
            const payload = (result && result.data && result.data.data) ? result.data.data : (result && result.data ? result.data : []);
            return { data: payload };
        } catch (error) {
            logger.error('PostService.getPost failed:', error);
            throw error;
        }
    }

    getPostForUser = async (email) => {
        try {
            authenticate();
            const result = await authAxios.get(`posts/email/${email}`)
            const payload = (result && result.data && result.data.data) ? result.data.data : (result && result.data ? result.data : []);
            return { data: payload };
        } catch (error) {
            logger.error('PostService.getPostForUser failed:', error);
            throw error;
        }
    }

    getSavedPostForUser = async (email) => {
        try {
            authenticate();
            const result = await authAxios.get(`posts/${email}/saved_posts`)
            return result;
        } catch (error) {
            logger.error('PostService.getSavedPostForUser failed:', error);
            throw error;
        }
    }

    createPost = async (userId, formdata, userTagId) => {
        try {
            authenticate();
            // Backend expects POST /api/v1/posts/ (userId comes from JWT token)
            const result = await authAxios.post(`posts/`, formdata, { params: { userTagId }}
        )
            return result
        } catch (error) {
            logger.error('PostService.createPost failed:', error);
            throw error;
        }
    }

    updatePost = async (postId, post) => {
        try {
            authenticate();
            const result = await authAxios.put(`posts/${postId}`, post)
            return result;
        } catch (error) {
            logger.error('PostService.updatePost failed:', error);
            throw error;
        }
    }

    deletePost = async (postid) => {
        try {
            authenticate();
            const result = await authAxios.delete(`posts/${postid}`)
            return result
        } catch (error) {
            logger.error('PostService.deletePost failed:', error);
            throw error;
        }
    }

    addComment = async (userid, postid, comment) => {
        try {
            authenticate();
            // Backend expects POST /api/v1/posts/:id/comment
            const result = await authAxios.post(`posts/${postid}/comment`, comment)
            return result
        } catch (error) {
            logger.error('PostService.addComment failed:', error);
            throw error;
        }
    }

    deleteComment = async (commentid) => {
        try {
            authenticate();
            // Backend expects DELETE /api/v1/posts/comments/:id
            const result = await authAxios.delete(`posts/comments/${commentid}`)
            return result
        } catch (error) {
            logger.error('PostService.deleteComment failed:', error);
            throw error;
        }
    }
    
    updateuserPassword = async(email,ConPass,password)=>{
        try {
            const result = await authAxios.put(`/users/${email}/change_password/${ConPass}`,password)
            return result
        } catch (error) {
            logger.error('PostService.updateuserPassword failed:', error);
            throw error;
        }
    }
    
    CheckOldPass = async (email,conpass) => {
        try {
            authenticate();
            const result = await authAxios.get(`/users/${email}/${conpass}`)
            return result;
        } catch (error) {
            logger.error('PostService.CheckOldPass failed:', error);
            throw error;
        }
    }
}

export default new PostService();