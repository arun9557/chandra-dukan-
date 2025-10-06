// OrderService.js - Orders ke liye API service
// Backend orders endpoints se integrate karta hai (Hinglish comments)

import axios from 'axios';

const API_BASE = 'http://localhost:3000/api'; // TODO: env se configurable banana future mein

const OrderService = {
  // Place order - Order place karna
  async placeOrder(orderPayload) {
    // orderPayload shape website jaisa: { customer_name, customer_phone, customer_address, customer_area, items, payment_method, total_amount, delivery_instructions }
    try {
      const response = await axios.post(`${API_BASE}/orders`, orderPayload);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Order place karne mein error:', error?.response?.data || error.message);
      throw error;
    }
  },

  // Get order by id - Order ko ID se lana
  async getOrderById(orderId) {
    try {
      const response = await axios.get(`${API_BASE}/orders/${orderId}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Order fetch karne mein error:', error?.response?.data || error.message);
      throw error;
    }
  },

  // List orders - Orders list karna (optional filters)
  async listOrders(params = {}) {
    try {
      const response = await axios.get(`${API_BASE}/orders`, { params });
      return response.data;
    } catch (error) {
      console.error('Orders list karne mein error:', error?.response?.data || error.message);
      throw error;
    }
  },

  // Update order status - Order status update karna
  async updateStatus(orderId, status) {
    try {
      const response = await axios.patch(`${API_BASE}/orders/${orderId}/status`, { status });
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Order status update error:', error?.response?.data || error.message);
      throw error;
    }
  },

  // Cancel order - Order cancel karna
  async cancelOrder(orderId) {
    try {
      const response = await axios.patch(`${API_BASE}/orders/${orderId}/cancel`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Order cancel karne mein error:', error?.response?.data || error.message);
      throw error;
    }
  },

  // Analytics summary - Analytics summary lana (dashboard parity)
  async getAnalyticsSummary(params = {}) {
    try {
      const response = await axios.get(`${API_BASE}/orders/analytics/summary`, { params });
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Analytics fetch error:', error?.response?.data || error.message);
      throw error;
    }
  },
};

export default OrderService;


