import axios from 'axios';

// Port 5005 is the permanent development API port.
// Update REACT_APP_API_URL in .env when deploying to production.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 8000,
});

api.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED') {
            error.userMessage = 'Request timed out. The server may be slow — please try again.';
        } else if (!error.response) {
            error.userMessage = `Cannot reach the API at ${API_BASE_URL}. Make sure the backend is running on port 5005.`;
        } else {
            error.userMessage = error.response?.data?.error || `Server error (${error.response.status})`;
        }
        return Promise.reject(error);
    }
);

export default api;
