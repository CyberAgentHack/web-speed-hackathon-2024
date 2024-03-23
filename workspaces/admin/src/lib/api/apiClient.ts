import ky from 'ky';

const createKyInstance = () => {
  const instance = ky.create({
    credentials: 'include',
    prefixUrl: process.env['API_URL'] || '/',
    timeout: false,
  });

  return instance;
};

export const apiClient = createKyInstance();
