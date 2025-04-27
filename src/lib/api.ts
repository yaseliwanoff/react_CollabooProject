import axios from 'axios';

const API_URL = 'http://collaboo.co/api-subs';

// Добавим новый базовый URL для платежей
const PAYMENT_API_URL = 'https://collaboo.co/api-payment/api/v1';

interface CreatePaymentFormPayload {
  subscription_price_id: number;
  gateway: string;
  promocode?: string;
}

export const createPaymentForm = async (payload: CreatePaymentFormPayload) => {
  const response = await axios.post(`${PAYMENT_API_URL}/payment-form/`, payload);
  return response.data; // здесь должен быть объект с полем `url`
};


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