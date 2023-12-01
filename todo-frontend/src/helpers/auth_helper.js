import api from './axios_helper';

export const login = async (username, password) => {
    try {
        const response = await api.post('auth/login', {
            username: username,
            password: password
        });
        return response;
    } catch (error) {
        let errorMsg = error.response?.data || "Unknown Error Occurred";


        throw new Error(errorMsg);
    }
}

export const signup = async (name, username, email, password) => {
    try {
        const response = await api.post('auth/signup', {
            name: name,
            username: username,
            email: email,
            password: password
        });
        return response;
    } catch (error) {
        let errorMsg = error.response?.data || "Unknown Error Occurred";

        throw new Error(errorMsg);
    }
}

export const updateAccount = async (updatedUser) => {
    try {
        const response = await api.put('auth/update', updatedUser, handleError, true, updatedUser.token);

        return response;
    } catch (error) {
        let errorMsg = error.response?.data || "Unknown Error Occurred";

        throw new Error(errorMsg);
    }
}

const handleError = (error) => {
    console.error("An error occurred during updating the user:", error);
};
