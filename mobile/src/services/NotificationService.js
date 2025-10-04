// Notification Service - Notification management service
// Push notifications and alerts for mobile app

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

class NotificationService {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
  }

  // Request permissions - Permissions request करना
  async requestPermissions() {
    try {
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
          throw new Error('Permission not granted for notifications');
        }
        
        return finalStatus === 'granted';
      } else {
        console.log('Must use physical device for Push Notifications');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  // Get push token - Push token get करना
  async getPushToken() {
    try {
      if (!Device.isDevice) {
        console.log('Must use physical device for Push Notifications');
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      });
      
      this.expoPushToken = token.data;
      return this.expoPushToken;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  // Setup notification listeners - Notification listeners setup करना
  setupListeners() {
    // Notification received listener
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      this.handleNotificationReceived(notification);
    });

    // Notification response listener
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      this.handleNotificationResponse(response);
    });
  }

  // Handle notification received - Notification received handle करना
  handleNotificationReceived(notification) {
    const { title, body, data } = notification.request.content;
    console.log('Notification received:', { title, body, data });
    
    // You can add custom logic here for handling different notification types
    switch (data?.type) {
      case 'order_update':
        this.handleOrderUpdateNotification(data);
        break;
      case 'promotion':
        this.handlePromotionNotification(data);
        break;
      case 'low_stock':
        this.handleLowStockNotification(data);
        break;
      default:
        console.log('Unknown notification type:', data?.type);
    }
  }

  // Handle notification response - Notification response handle करना
  handleNotificationResponse(response) {
    const { data } = response.notification.request.content;
    console.log('Notification response:', data);
    
    // Navigate based on notification data
    if (data?.screen) {
      // You can use navigation here to navigate to specific screens
      console.log('Navigate to screen:', data.screen);
    }
  }

  // Send local notification - Local notification भेजना
  async sendLocalNotification(title, body, data = {}) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  }

  // Send order notification - Order notification भेजना
  async sendOrderNotification(orderData) {
    const title = '🎉 Order Placed Successfully!';
    const body = `Order #${orderData.id} - ₹${orderData.total}`;
    const data = {
      type: 'order_update',
      orderId: orderData.id,
      screen: 'OrderTracking',
    };

    await this.sendLocalNotification(title, body, data);
  }

  // Send order status update - Order status update भेजना
  async sendOrderStatusUpdate(orderId, status) {
    const statusMessages = {
      'confirmed': 'Your order has been confirmed',
      'processing': 'Your order is being prepared',
      'packed': 'Your order is packed and ready',
      'out_for_delivery': 'Your order is out for delivery',
      'delivered': 'Your order has been delivered',
      'cancelled': 'Your order has been cancelled',
    };

    const title = 'Order Update';
    const body = statusMessages[status] || 'Order status updated';
    const data = {
      type: 'order_update',
      orderId,
      status,
      screen: 'OrderTracking',
    };

    await this.sendLocalNotification(title, body, data);
  }

  // Send promotion notification - Promotion notification भेजना
  async sendPromotionNotification(offer) {
    const title = '🎉 Special Offer!';
    const body = offer.message;
    const data = {
      type: 'promotion',
      offerId: offer.id,
      screen: 'Products',
    };

    await this.sendLocalNotification(title, body, data);
  }

  // Send low stock alert - Low stock alert भेजना
  async sendLowStockAlert(product) {
    const title = '⚠️ Low Stock Alert';
    const body = `${product.name} is running low (${product.stock} left)`;
    const data = {
      type: 'low_stock',
      productId: product.id,
      screen: 'Dashboard',
    };

    await this.sendLocalNotification(title, body, data);
  }

  // Handle order update notification - Order update notification handle करना
  handleOrderUpdateNotification(data) {
    console.log('Order update notification:', data);
    // You can add custom logic here for order updates
  }

  // Handle promotion notification - Promotion notification handle करना
  handlePromotionNotification(data) {
    console.log('Promotion notification:', data);
    // You can add custom logic here for promotions
  }

  // Handle low stock notification - Low stock notification handle करना
  handleLowStockNotification(data) {
    console.log('Low stock notification:', data);
    // You can add custom logic here for low stock alerts
  }

  // Cancel all notifications - सभी notifications cancel करना
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  }

  // Get notification settings - Notification settings get करना
  async getNotificationSettings() {
    try {
      const settings = await Notifications.getPermissionsAsync();
      return settings;
    } catch (error) {
      console.error('Error getting notification settings:', error);
      return null;
    }
  }

  // Cleanup listeners - Listeners cleanup करना
  cleanup() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }
}

export default new NotificationService();
