export const API_BASE_URL = "http://localhost:8000";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/user/login`,
    REGISTER: `${API_BASE_URL}/user`,
  },
  PRODUCTS: {
    BASE: `${API_BASE_URL}/products`,
    SEARCH: `${API_BASE_URL}/products/search`,
  },
  CART: {
    BASE: `${API_BASE_URL}/cart`,
  },
  ORDERS: {
    BASE: `${API_BASE_URL}/orders`,
  },
  CHATBOT: {
    GENERATE: `${API_BASE_URL}/generate`,
  },
}; 