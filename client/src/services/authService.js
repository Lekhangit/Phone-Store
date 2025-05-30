import axios from 'axios';
import { API_ENDPOINTS } from '../utils/constants';

export const login = async (username, password) => {
  const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, { username, password });
  return response.data;
};

export const register = async (username, password) => {
  const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, { username, password });
  return response.data;
}; 