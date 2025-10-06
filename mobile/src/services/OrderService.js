// OrderService.js - Orders ke liye API service with GraphQL
// Backend orders endpoints se integrate karta hai (Hinglish comments)

import { gql } from '@apollo/client';
import client from './api';

const OrderService = {
  // Place order - Order place karna
  async placeOrder(orderPayload) {
    // orderPayload shape website jaisa: { customer_name, customer_phone, customer_address, customer_area, items, payment_method, total_amount, delivery_instructions }
    try {
      const PLACE_ORDER_MUTATION = gql`
        mutation PlaceOrder($input: OrderInput!) {
          placeOrder(input: $input) {
            id
            orderNumber
            customer_name
            customer_phone
            customer_address
            customer_area
            items {
              product_id
              product_name
              quantity
              price
            }
            payment_method
            total_amount
            delivery_instructions
            status
            createdAt
          }
        }
      `;

      const { data } = await client.mutate({
        mutation: PLACE_ORDER_MUTATION,
        variables: { input: orderPayload },
      });

      return data?.placeOrder || data;
    } catch (error) {
      console.error('Order place karne mein error:', error.message);
      throw error;
    }
  },

  // Get order by id - Order ko ID se lana
  async getOrderById(orderId) {
    try {
      const GET_ORDER_BY_ID = gql`
        query GetOrderById($id: ID!) {
          order(id: $id) {
            id
            orderNumber
            customer_name
            customer_phone
            customer_address
            customer_area
            items {
              product_id
              product_name
              quantity
              price
              image
            }
            payment_method
            total_amount
            delivery_instructions
            status
            createdAt
            updatedAt
            deliveredAt
          }
        }
      `;

      const { data } = await client.query({
        query: GET_ORDER_BY_ID,
        variables: { id: orderId },
        fetchPolicy: 'network-only',
      });

      return data?.order || data;
    } catch (error) {
      console.error('Order fetch karne mein error:', error.message);
      throw error;
    }
  },

  // List orders - Orders list karna (optional filters)
  async listOrders(params = {}) {
    try {
      const LIST_ORDERS = gql`
        query ListOrders($filters: OrderFilters) {
          orders(filters: $filters) {
            id
            orderNumber
            customer_name
            customer_phone
            customer_area
            items {
              product_id
              product_name
              quantity
              price
            }
            payment_method
            total_amount
            status
            createdAt
          }
        }
      `;

      const { data } = await client.query({
        query: LIST_ORDERS,
        variables: { filters: params },
        fetchPolicy: 'network-only',
      });

      return data;
    } catch (error) {
      console.error('Orders list karne mein error:', error.message);
      throw error;
    }
  },

  // Update order status - Order status update karna
  async updateStatus(orderId, status) {
    try {
      const UPDATE_ORDER_STATUS = gql`
        mutation UpdateOrderStatus($id: ID!, $status: String!) {
          updateOrderStatus(id: $id, status: $status) {
            id
            orderNumber
            status
            updatedAt
          }
        }
      `;

      const { data } = await client.mutate({
        mutation: UPDATE_ORDER_STATUS,
        variables: { id: orderId, status },
      });

      return data?.updateOrderStatus || data;
    } catch (error) {
      console.error('Order status update error:', error.message);
      throw error;
    }
  },

  // Cancel order - Order cancel karna
  async cancelOrder(orderId) {
    try {
      const CANCEL_ORDER = gql`
        mutation CancelOrder($id: ID!) {
          cancelOrder(id: $id) {
            id
            orderNumber
            status
            updatedAt
          }
        }
      `;

      const { data } = await client.mutate({
        mutation: CANCEL_ORDER,
        variables: { id: orderId },
      });

      return data?.cancelOrder || data;
    } catch (error) {
      console.error('Order cancel karne mein error:', error.message);
      throw error;
    }
  },

  // Analytics summary - Analytics summary lana (dashboard parity)
  async getAnalyticsSummary(params = {}) {
    try {
      const GET_ANALYTICS = gql`
        query GetAnalyticsSummary($filters: AnalyticsFilters) {
          analyticsSummary(filters: $filters) {
            totalOrders
            pendingOrders
            completedOrders
            cancelledOrders
            totalRevenue
            averageOrderValue
            topProducts {
              product_id
              product_name
              totalSold
              revenue
            }
            recentOrders {
              id
              orderNumber
              customer_name
              total_amount
              status
              createdAt
            }
          }
        }
      `;

      const { data } = await client.query({
        query: GET_ANALYTICS,
        variables: { filters: params },
        fetchPolicy: 'network-only',
      });

      return data?.analyticsSummary || data;
    } catch (error) {
      console.error('Analytics fetch error:', error.message);
      throw error;
    }
  },
};

export default OrderService;


