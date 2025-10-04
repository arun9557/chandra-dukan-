// NotificationService - Notification management service
// Notification का management service

class NotificationService {
  constructor() {
    this.permission = 'default';
    this.init();
  }

  // Initialize notification service - Notification service initialize करना
  init() {
    this.requestPermission();
    this.setupServiceWorker();
  }

  // Request notification permission - Notification permission request करना
  async requestPermission() {
    if ('Notification' in window) {
      this.permission = await Notification.requestPermission();
    }
  }

  // Setup service worker - Service worker setup करना
  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error);
        });
    }
  }

  // Send push notification - Push notification भेजना
  sendPushNotification(title, body, icon = '/favicon.ico') {
    if (this.permission === 'granted') {
      const notification = new Notification(title, {
        body: body,
        icon: icon,
        badge: icon,
        tag: 'chandra-dukan',
        requireInteraction: true
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    }
  }

  // Send order notification - Order notification भेजना
  sendOrderNotification(orderData) {
    const title = '🎉 New Order Received!';
    const body = `Order #${orderData.id} - ₹${orderData.total} from ${orderData.customer.name}`;
    
    this.sendPushNotification(title, body);
    this.sendWhatsAppNotification(orderData);
    this.sendSMSNotification(orderData);
  }

  // Send WhatsApp notification - WhatsApp notification भेजना
  sendWhatsAppNotification(orderData) {
    const message = this.formatWhatsAppMessage(orderData);
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
  }

  // Format WhatsApp message - WhatsApp message format करना
  formatWhatsAppMessage(orderData) {
    return `🎉 *New Order Received!*

*Order ID:* ${orderData.id}
*Customer:* ${orderData.customer.name}
*Phone:* ${orderData.customer.phone}
*Address:* ${orderData.customer.address}
*Area:* ${orderData.customer.area}
*Total:* ₹${orderData.total}
*Payment:* ${orderData.payment.toUpperCase()}

*Items:*
${orderData.items.map(item => `• ${item.name} × ${item.quantity} = ₹${item.price * item.quantity}`).join('\n')}

*Time:* ${new Date(orderData.timestamp).toLocaleString()}`;
  }

  // Send SMS notification - SMS notification भेजना
  sendSMSNotification(orderData) {
    // In a real app, this would integrate with SMS service like Twilio
    const smsMessage = `New Order #${orderData.id} - ₹${orderData.total} from ${orderData.customer.name}`;
    console.log('SMS would be sent:', smsMessage);
    
    // For demo purposes, we'll just log it
    this.logNotification('SMS', smsMessage);
  }

  // Send delivery notification - Delivery notification भेजना
  sendDeliveryNotification(orderData, status) {
    const statusMessages = {
      'processing': 'Your order is being prepared',
      'packed': 'Your order is packed and ready for delivery',
      'out_for_delivery': 'Your order is out for delivery',
      'delivered': 'Your order has been delivered'
    };

    const title = `Order #${orderData.id} Update`;
    const body = statusMessages[status] || 'Order status updated';
    
    this.sendPushNotification(title, body);
  }

  // Send low stock alert - Low stock alert भेजना
  sendLowStockAlert(product) {
    const title = '⚠️ Low Stock Alert';
    const body = `${product.name} is running low (${product.stock} left)`;
    
    this.sendPushNotification(title, body);
  }

  // Send daily summary - Daily summary भेजना
  sendDailySummary(summary) {
    const title = '📊 Daily Sales Summary';
    const body = `Orders: ${summary.orders} | Revenue: ₹${summary.revenue}`;
    
    this.sendPushNotification(title, body);
  }

  // Log notification - Notification log करना
  logNotification(type, message) {
    const log = {
      type: type,
      message: message,
      timestamp: new Date().toISOString()
    };
    
    // Store in localStorage for debugging
    const logs = JSON.parse(localStorage.getItem('notificationLogs') || '[]');
    logs.push(log);
    localStorage.setItem('notificationLogs', JSON.stringify(logs.slice(-50))); // Keep last 50 logs
  }

  // Get notification logs - Notification logs get करना
  getNotificationLogs() {
    return JSON.parse(localStorage.getItem('notificationLogs') || '[]');
  }

  // Clear notification logs - Notification logs clear करना
  clearNotificationLogs() {
    localStorage.removeItem('notificationLogs');
  }

  // Test notification - Test notification भेजना
  testNotification() {
    this.sendPushNotification(
      'Test Notification',
      'This is a test notification from Chandra Dukan',
      '/favicon.ico'
    );
  }

  // Send bulk notification - Bulk notification भेजना
  sendBulkNotification(customers, message) {
    // In a real app, this would integrate with bulk messaging service
    customers.forEach(customer => {
      console.log(`Sending to ${customer.phone}: ${message}`);
    });
  }

  // Schedule notification - Notification schedule करना
  scheduleNotification(title, body, delay) {
    setTimeout(() => {
      this.sendPushNotification(title, body);
    }, delay);
  }

  // Send promotional notification - Promotional notification भेजना
  sendPromotionalNotification(offer) {
    const title = '🎉 Special Offer!';
    const body = offer.message;
    
    this.sendPushNotification(title, body);
  }
}

// Export for use in main app
window.NotificationService = new NotificationService();
