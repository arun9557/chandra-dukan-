// Cart Service - Cart management service
// Shopping cart functionality for mobile app

import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductService from './ProductService';

class CartService {
  constructor() {
    this.cartKey = 'chandra_dukan_cart';
  }

  // Add item to cart - Cart में item add करना
  async addItem(productId, quantity = 1) {
    try {
      const product = await ProductService.getProductById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      if (product.stock === 0) {
        throw new Error('Product out of stock');
      }

      const cart = await this.getCart();
      const existingItem = cart.find(item => item.id === productId);

      if (existingItem) {
        if (existingItem.quantity + quantity > product.stock) {
          throw new Error('Not enough stock available');
        }
        existingItem.quantity += quantity;
      } else {
        cart.push({
          id: productId,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.image,
          category_id: product.category_id,
        });
      }

      await this.saveCart(cart);
      return { product, quantity };
    } catch (error) {
      throw new Error(`Failed to add item to cart: ${error.message}`);
    }
  }

  // Update item quantity - Item quantity update करना
  async updateQuantity(productId, quantity) {
    try {
      const cart = await this.getCart();
      const item = cart.find(item => item.id === productId);

      if (!item) {
        throw new Error('Item not found in cart');
      }

      if (quantity <= 0) {
        return await this.removeItem(productId);
      }

      // Check stock availability
      const product = await ProductService.getProductById(productId);
      if (quantity > product.stock) {
        throw new Error('Not enough stock available');
      }

      item.quantity = quantity;
      await this.saveCart(cart);
      return { productId, quantity };
    } catch (error) {
      throw new Error(`Failed to update quantity: ${error.message}`);
    }
  }

  // Remove item from cart - Cart से item remove करना
  async removeItem(productId) {
    try {
      const cart = await this.getCart();
      const updatedCart = cart.filter(item => item.id !== productId);
      await this.saveCart(updatedCart);
      return { productId };
    } catch (error) {
      throw new Error(`Failed to remove item: ${error.message}`);
    }
  }

  // Clear cart - Cart clear करना
  async clearCart() {
    try {
      await AsyncStorage.removeItem(this.cartKey);
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to clear cart: ${error.message}`);
    }
  }

  // Get cart - Cart get करना
  async getCart() {
    try {
      const cartData = await AsyncStorage.getItem(this.cartKey);
      if (!cartData) {
        return [];
      }
      return JSON.parse(cartData);
    } catch (error) {
      console.error('Error getting cart:', error);
      return [];
    }
  }

  // Save cart - Cart save करना
  async saveCart(cart) {
    try {
      await AsyncStorage.setItem(this.cartKey, JSON.stringify(cart));
    } catch (error) {
      throw new Error(`Failed to save cart: ${error.message}`);
    }
  }

  // Get cart summary - Cart summary get करना
  async getCartSummary() {
    try {
      const cart = await this.getCart();
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const deliveryCharges = total >= 200 ? 0 : 30;
      const finalTotal = total + deliveryCharges;
      const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: cart,
        total,
        deliveryCharges,
        finalTotal,
        itemCount,
      };
    } catch (error) {
      throw new Error(`Failed to get cart summary: ${error.message}`);
    }
  }

  // Validate cart - Cart validate करना
  async validateCart() {
    try {
      const cart = await this.getCart();
      const errors = [];

      if (cart.length === 0) {
        errors.push('Cart is empty');
        return { isValid: false, errors };
      }

      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      if (total < 100) {
        errors.push('Minimum order amount is ₹100');
      }

      // Check stock availability
      for (const item of cart) {
        const product = await ProductService.getProductById(item.id);
        if (!product) {
          errors.push(`${item.name} - Product not found`);
        } else if (item.quantity > product.stock) {
          errors.push(`${item.name} - Only ${product.stock} available`);
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
      };
    } catch (error) {
      throw new Error(`Failed to validate cart: ${error.message}`);
    }
  }

  // Get cart item count - Cart item count get करना
  async getCartItemCount() {
    try {
      const cart = await this.getCart();
      return cart.reduce((sum, item) => sum + item.quantity, 0);
    } catch (error) {
      console.error('Error getting cart item count:', error);
      return 0;
    }
  }

  // Check if item is in cart - Item cart में है या नहीं check करना
  async isItemInCart(productId) {
    try {
      const cart = await this.getCart();
      return cart.some(item => item.id === productId);
    } catch (error) {
      console.error('Error checking if item is in cart:', error);
      return false;
    }
  }

  // Get item quantity in cart - Cart में item quantity get करना
  async getItemQuantity(productId) {
    try {
      const cart = await this.getCart();
      const item = cart.find(item => item.id === productId);
      return item ? item.quantity : 0;
    } catch (error) {
      console.error('Error getting item quantity:', error);
      return 0;
    }
  }
}

export default new CartService();
