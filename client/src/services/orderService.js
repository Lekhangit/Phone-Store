import axios from 'axios';
import { API_ENDPOINTS } from '../utils/constants';

export const getOrders = async (limit = 100) => {
  const response = await axios.get(`${API_ENDPOINTS.ORDERS.BASE}?limit=${limit}`);
  return response.data;
};

export const createOrder = async (userId, items) => {
  const response = await axios.post(API_ENDPOINTS.ORDERS.BASE, {
    user_id: userId,
    items
  });
  return response.data;
}; 