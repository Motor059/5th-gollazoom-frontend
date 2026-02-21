import api from './axios';

export const getWeatherSummary = async () => {
  const response = await api.get('/api/weather/today/summary');
  return response.data; 
};

export const getWeatherDetail = async () => {
  const response = await api.get('/api/weather/today');
  return response.data;
};