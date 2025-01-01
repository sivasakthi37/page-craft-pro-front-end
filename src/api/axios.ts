import axios, { AxiosInstance } from "axios";

// Get the base URL from environment variables
const baseURL = `${import.meta.env.VITE_BASE_URL}/api` || "http://localhost:3000/api";

const axiosInstance: AxiosInstance = axios.create({
    baseURL,
    timeout: 10000, // 10 seconds timeout
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        // Example: Add Authorization header
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear authentication tokens
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Redirect to signin page
            // Note: This is a global redirect and might need to be adjusted 
            // based on your routing strategy
            window.location.href = '/signin';
        } else {
            console.error("API Error:", error);
        }
        return Promise.reject(error);
    }
);


export default axiosInstance;
