import { BaseAPI } from './_constant.js';
import { toast } from 'react-hot-toast';

// Helper function to handle API requests
const apiRequest = async (api, method, data = null) => {
    // Retrieve the user object from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    const accessToken = userData?.tokens?.access;
    const refreshToken = userData?.tokens?.refresh;

    console.log(accessToken)
    console.log(refreshToken)

    if (!accessToken) {
        if (!refreshToken) {
            toast.error('Authentication failed. Please log in again.');
            return Promise.reject('No tokens available');
        }
    }


    const requestUrl = `${BaseAPI}${api}`;
    let headers = {
        'Authorization': `${accessToken}`, // Using Bearer scheme for JWT
        'Content-Type': 'application/json',
    };

    if (method === 'GET' || method === 'DELETE') {
        delete headers['Content-Type'];
    }

    const makeRequest = async () => {
        return fetch(requestUrl, {
            method,
            headers,
            body: data ? JSON.stringify(data) : null,
        });
    };

    let response = await makeRequest();

    // If unauthorized, try refreshing the token
    if (response.status === 401 && refreshToken) {
        try {
            const refreshResponse = await fetch(`${BaseAPI}/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            if (refreshResponse.ok) {
                const newTokens = await refreshResponse.json();
                userData.tokens.access = newTokens.access;
                localStorage.setItem('user', JSON.stringify(userData)); // Update localStorage
                headers['Authorization'] = `Bearer ${newTokens.access}`; // Update access token
                response = await makeRequest(); // Retry the original request
            } else {
                throw new Error('Token refresh failed. Please log in again.');
            }
        } catch (error) {
            toast.error('Session expired. Please log in again.');
            return Promise.reject('Refresh token invalid or expired');
        }
    }

    if (response.ok) {
        return response.json();
    } else {
        try {
            const res = await response.json();
            toast.error(res.error || 'Unexpected error occurred');
        } catch (err) {
            toast.error('Sorry! Something went wrong on our side.');
        }
        return Promise.reject('Request failed');
    }
};

// API shorthand methods
const get = (api) => apiRequest(api, 'GET');
const deleteApi = (api) => apiRequest(api, 'DELETE');
const postApi = (api, data) => apiRequest(api, 'POST', data);
const patchApi = (api, data) => apiRequest(api, 'PATCH', data);

export { get, deleteApi, postApi, patchApi };
