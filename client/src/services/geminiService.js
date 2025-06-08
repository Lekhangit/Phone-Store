import axios from 'axios';
import { API_ENDPOINTS } from '../utils/constants';
 
export const generateResponse = async (prompt) => {
  const response = await axios.post(API_ENDPOINTS.CHATBOT.GENERATE, { prompt });
  return response.data;
}; 