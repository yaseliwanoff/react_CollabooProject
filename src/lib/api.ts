import axios from 'axios';

const API_URL = 'http://collaboo.co/api-subs';

export const getOrigins = async () => {
  const response = await axios.get(`${API_URL}/origin`);
  return response.data;
};

export const getSubPlans = async () => {
  const response = await axios.get(`${API_URL}/subplan`);
  return response.data;
};

export const getSubPrices = async () => {
  const response = await axios.get(`${API_URL}/subprice`);
  return response.data;
};