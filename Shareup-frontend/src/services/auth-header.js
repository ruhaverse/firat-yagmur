export default function authHeader() {
    try {
        const userStr = localStorage.getItem('user');
        
        if (!userStr || userStr === 'undefined') {
            return {};
        }
        
        const user = JSON.parse(userStr);

        if (user && user.accessToken) {
            return { Authorization: 'Bearer ' + user.accessToken };
        }
        
        return {};
    } catch (error) {
        // Handle corrupted localStorage data
        console.error('Error parsing auth header:', error);
        return {};
    }
}