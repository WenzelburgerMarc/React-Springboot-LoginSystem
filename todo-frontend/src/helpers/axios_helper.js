import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api/',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

const request = (requestMethod, url, data = {}, onError, withToken, token) => {
    if (withToken && token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }

    return axiosInstance({
        method: requestMethod,
        url: url,
        data: data
    }).then(response => {
        return response.data;
    }).catch(error => {
        if (onError) {
            onError(error);
        }
        return Promise.reject(error);
    });
};

export default {
    get(url, onError, withToken = false, token = null) {
        return request('GET', url, {}, onError, withToken, token);
    },
    post(url, data, onError, withToken = false, token = null) {
        return request('POST', url, data, onError, withToken, token);
    },
    put(url, data, onError, withToken = false, token = null) {
        return request('PUT', url, data, onError, withToken, token);
    },
    delete(url, onError, withToken = false, token = null) {
        return request('DELETE', url, {}, onError, withToken, token);
    }
};
