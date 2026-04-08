import axios from 'axios';

const API_BASE_URL = 'https://restaurant-order-tracker-mv27.onrender.com/api';

export const fetchOrders = async () => {
  const response = await axios.get(`${API_BASE_URL}/orders`);
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
  return response.data;
};

export const updateOrderStatus = async (id, newStatus = null) => {
  const payload = newStatus ? { newStatus } : {};
  const response = await axios.patch(`${API_BASE_URL}/orders/${id}/status`, payload);
  return response.data;
};
