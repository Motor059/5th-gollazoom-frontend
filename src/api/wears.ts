import api from './axios';

export const registerDailyWear = async (date: string, clothIds: number[], memo: string = "오늘의 긴급 추천 코디") => {
  const response = await api.post('/api/wears', {
    date: date,
    clothIds: clothIds,
    memo: memo
  });
  return response.data;
};

export const getDailyWear = async (date: string) => {
  const response = await api.get('/api/wears', {
    params: { date: date }
  });
  return response.data; 
};