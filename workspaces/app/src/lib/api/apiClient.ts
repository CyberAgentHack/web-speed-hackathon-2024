import axios from 'axios';

const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: process.env['API_URL'] || '/',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return instance;
};

export const apiClient = createAxiosInstance();
