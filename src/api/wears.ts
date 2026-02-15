import api from './axios';

export const getDailyWear = async (date: string) => {
  const response = await api.get('/api/wears', {
    params: { date: date }
  });
  return response.data; 
};