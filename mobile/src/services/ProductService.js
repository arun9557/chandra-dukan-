// ProductService.js - Product service for GraphQL API calls
import { gql } from '@apollo/client';
import client from './api';

const ProductService = {
  // Get all categories
  getCategories: async () => {
    try {
      const GET_CATEGORIES = gql`
        query GetCategories {
          categories {
            id
            name
            icon
            arabic_name
          }
        }
      `;

      const { data } = await client.query({
        query: GET_CATEGORIES,
        fetchPolicy: 'network-only',
      });

      return data?.categories || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Return sample data as fallback
      return [
        { id: 1, name: 'Dairy & Bread', icon: '🥛', arabic_name: 'اللبن والخبز' },
        { id: 2, name: 'Snacks', icon: '🍿', arabic_name: 'السناكس' },
        { id: 3, name: 'Beverages', icon: '🥤', arabic_name: 'المشروبات' },
        { id: 4, name: 'Vegetables', icon: '🥬', arabic_name: 'الخضروات' },
      ];
    }
  },

  // Get featured products
  getFeaturedProducts: async () => {
    try {
      const GET_FEATURED_PRODUCTS = gql`
        query GetFeaturedProducts {
          products(featured: true) {
            id
            name
            description
            price
            originalPrice
            image
            category
            featured
            stock
            unit
            arabic_name
          }
        }
      `;

      const { data } = await client.query({
        query: GET_FEATURED_PRODUCTS,
        fetchPolicy: 'network-only',
      });

      return data?.products || [];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [
        { id: 1, name: 'Amul Milk', price: 29, image: 'https://via.placeholder.com/150' },
        { id: 2, name: 'Bread', price: 25, image: 'https://via.placeholder.com/150' },
      ];
    }
  },

  // Get store info
  getStoreInfo: async () => {
    try {
      const GET_STORE_INFO = gql`
        query GetStoreInfo {
          storeInfo {
            name
            description
            address
            phone
            email
            openingHours
            logo
            socialMedia {
              facebook
              instagram
              twitter
            }
          }
        }
      `;

      const { data } = await client.query({
        query: GET_STORE_INFO,
        fetchPolicy: 'cache-first',
      });

      return data?.storeInfo || {};
    } catch (error) {
      console.error('Error fetching store info:', error);
      // Return sample data as fallback
      return {
        name: 'Chandra Dukan',
        description: 'Your local grocery store',
        address: '123 Main St, Your City',
        phone: '+91 98765 43210',
        email: 'info@chandradukan.com',
      };
    }
  },

  // Get all products
  getAllProducts: async () => {
    try {
      const GET_ALL_PRODUCTS = gql`
        query GetAllProducts {
          products {
            id
            name
            description
            price
            originalPrice
            image
            category
            featured
            stock
            unit
            arabic_name
          }
        }
      `;

      const { data } = await client.query({
        query: GET_ALL_PRODUCTS,
        fetchPolicy: 'network-only',
      });

      return data?.products || [];
    } catch (error) {
      console.error('Error fetching all products:', error);
      return [];
    }
  },

  // Get product by id - Product ko ID se lana (cart parity ke liye)
  getProductById: async (productId) => {
    try {
      const GET_PRODUCT_BY_ID = gql`
        query GetProductById($id: ID!) {
          product(id: $id) {
            id
            name
            description
            price
            originalPrice
            image
            category
            featured
            stock
            unit
            arabic_name
            details
            rating
            reviews {
              id
              user
              rating
              comment
              createdAt
            }
          }
        }
      `;

      const { data } = await client.query({
        query: GET_PRODUCT_BY_ID,
        variables: { id: productId },
        fetchPolicy: 'network-only',
      });

      return data?.product || null;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      return null;
    }
  },
};
