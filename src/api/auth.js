import { BaseAPI } from './_constant'

function loginBackend(username, password) {
    return fetch(BaseAPI + 'system/auth/login/', {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            phone_number: username,
            password: password
        }),
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((err) => Promise.reject(err));
            }
            return response.json();
        });
}
function getUserData() {
    const jwt = localStorage.getItem('accessToken');

    if (!jwt) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            return Promise.reject();
        }
    }
    return fetch(BaseAPI + '/app/whoami/', {
        headers: {
            'Authorization': `${jwt}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(error => {
            console.error('There was a problem with the getUserData operation:', error);
        });
}

export { loginBackend, getUserData }