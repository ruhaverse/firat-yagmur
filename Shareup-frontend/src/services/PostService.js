import axios from 'axios';
import AuthService from './auth.services';
import settings from "./Settings";

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
        authenticate();
        const result = await authAxios.get('posts/')
        return result;
    }

    // getPostForUser = async (id) => {
    //     authenticate();
    //     const result = await authAxios.get(`posts/${id}`)
    //     return result;
    // }

    getPostForUser = async (email) => {
        authenticate();
        const result = await authAxios.get(`posts/email/${email}`)
        return result;
    }

    getSavedPostForUser = async (email) => {
        authenticate();
        const result = await authAxios.get(`posts/${email}/saved_posts`)
        return result;
    }

    createPost = async (userId, formdata, userTagId) => {
        authenticate();
        const result = await authAxios.post(`posts/${userId}`,formdata, { params: { userTagId }}
    )
        return result
    }

    updatePost = async (postId, post) => {
        authenticate();
        const result = await authAxios.put(`posts/${postId}`, post)
        return result;
    }

    deletePost = async (postid) => {
        authenticate();
        const result = await authAxios.delete(`posts/${postid}`)
        return result
    }

    addComment = async (userid, postid, comment) => {
        authenticate();
        const result = await authAxios.post(`comment/${userid}/${postid}`, comment)
        return result
    }

    deleteComment = async (commentid) => {
        authenticate();
        const result = await authAxios.delete(`comment/${commentid}`)
        return result
    }
    updateuserPassword = async(email,ConPass,password)=>{
       const result = await authAxios.put(`/users/${email}/change_password/${ConPass}`,password)
       return result
     }
     CheckOldPass = async (email,conpass) => {
        authenticate();
        const result = await authAxios.get(`/users/${email}/${conpass}`)
        return result;
    }

}

export default new PostService();