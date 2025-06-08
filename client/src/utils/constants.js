export const API_BASE_URL = "http://localhost:8000";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/users/login`,
    REGISTER: `${API_BASE_URL}/api/users`,
  },
  PRODUCTS: {
    BASE: `${API_BASE_URL}/products`,
    SEARCH: `${API_BASE_URL}/products/search`,
  },
  CART: {
    BASE: `${API_BASE_URL}/api/carts`,
  },
  ORDERS: {
    BASE: `${API_BASE_URL}/api/orders`,
  },
  CHATBOT: {
    GENERATE: `${API_BASE_URL}/api/gemini/generate`,
  },
}; 