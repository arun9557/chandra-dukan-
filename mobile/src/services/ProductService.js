// ProductService.js - Product service for API calls
import axios from 'axios';

const API_BASE = 'http://192.168.31.84:3000/api';

const ProductService = {
  // Get all categories
  getCategories: async () => {
    try {
      const response = await axios.get(`${API_BASE}/categories`);
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Return sample data as fallback
      return [
        { id: 1, name: 'Dairy & Bread', icon: '🥛', hindi_name: 'डेयरी और ब्रेड' },
        { id: 2, name: 'Snacks', icon: '🍿', hindi_name: 'स्नैक्स' },
        { id: 3, name: 'Beverages', icon: '🥤', hindi_name: 'पेय पदार्थ' },
        { id: 4, name: 'Vegetables', icon: '🥬', hindi_name: 'सब्जियां' },
      ];
    }
  },

  // Get featured products
  getFeaturedProducts: async () => {
    try {
      const response = await axios.get(`${API_BASE}/products?featured=true`);
      return response.data.data || response.data || [];
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
      const response = await axios.get(`${API_BASE}/store/info`);
      return response.data;
    } catch (error) {
      console.error('Error fetching store info:', error);
      return {
        name: 'Chandra Dukan',
        isOpen: true,
        deliveryTime: '1 Day',
      };
    }
  },

  // Get all products
  getAllProducts: async () => {
    try {
      const response = await axios.get(`${API_BASE}/products`);
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  // Get product by id - Product ko ID se lana (cart parity ke liye)
  getProductById: async (productId) => {
    try {
      // Backend mein individual GET endpoint specified nahi dikh raha; fallback: list aur filter
      const products = await ProductService.getAllProducts();
      return products.find(p => p.id === productId) || null;
    } catch (error) {
      console.error('Error fetching product by id:', error);
      return null;
    }
  },
};

export default ProductService;
