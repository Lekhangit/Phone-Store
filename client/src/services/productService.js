import axios from 'axios';
import { API_ENDPOINTS } from '../utils/constants';

export const getProducts = async (limit = 100) => {
  const response = await axios.get(`${API_ENDPOINTS.PRODUCTS.BASE}?limit=${limit}`);
  return response.data;
};

export const getProductById = async (productId) => {
  const response = await axios.get(`${API_ENDPOINTS.PRODUCTS.BASE}/${productId}`);
  return response.data;
};

export const searchProducts = async (name) => {
  const response = await axios.get(`${API_ENDPOINTS.PRODUCTS.SEARCH}?name=${encodeURIComponent(name)}`);
  return response.data;
}; 