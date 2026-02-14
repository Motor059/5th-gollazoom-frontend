import api from './axios';

interface changePassword {
    currentpassword: string;
    newpassword: string;
}

interface UserData {
    username: string;
    password: string;
    nickname: string;
}

interface Credentials {
    username: string;
    password: string;
}

export const signup = async (userData: UserData) => {
    const response = await api.post('/users/signup', userData);
    return response.data;
}

export const login = async (credentials: Credentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
}

export const changePassword = async (userPassword: changePassword) => {
  const response = await api.patch(`/users/password`, userPassword);
  return response.data;
};

export const deleteUser = async () => {
    const response = await api.delete(`/users/me`);
    return response.data;
}

export const getUserInfo = async () => {
    const response = await api.get('/users/me');
    return response.data;
}

export const setWorkTime = async (worktime: string) => {
    const response = await api.post('/users/time', { worktime });
    return response.data;
}

export const checkUsername = async (username: string) => {
    const response = await api.get('/users/username', {
        params: { 
            username: username
        }
    });
    return response.data;
}

export const changeNickname = async (nickname: string) => {
  const response = await api.patch(`/users/nickname`, { nickname });
  return response.data;
};

export const changeWorktime = async (worktime: string) => {
    const response = await api.patch('/users/time', { worktime });
    return response.data;
}