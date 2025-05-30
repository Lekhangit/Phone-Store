import axios from 'axios';
import { API_ENDPOINTS } from '../utils/constants';

export const getCart = async (userId) => {
  const response = await axios.get(`${API_ENDPOINTS.CART.BASE}/${userId}`);
  return response.data;
};

export const addToCart = async (userId, items) => {
  const response = await axios.post(API_ENDPOINTS.CART.BASE, {
    user_id: userId,
    items
  });
  return response.data;
};

export const createCart = async (userId) => {
  const response = await axios.post(API_ENDPOINTS.CART.BASE, {
    user_id: userId,
    items: []
  });
  return response.data;
}; 