export default function authHeader() {
    try {
        const userStr = localStorage.getItem('user');
        
        if (!userStr || userStr === 'undefined') {
            return {};
        }
        
        const user = JSON.parse(userStr);

        // Support both legacy 'accessToken' and current 'jwt' storage formats
        const token = (user && (user.jwt || user.accessToken)) || null;
        if (token) {
            return { Authorization: 'Bearer ' + token };
        }
        
        return {};
    } catch (error) {
        // Handle corrupted localStorage data
        console.error('Error parsing auth header:', error);
        return {};
    }
}