// Helper utilities - Helper functions का collection
// Common utility functions for the app

class Helpers {
  // Format currency - Currency format करना
  static formatCurrency(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
  }

  // Format phone number - Phone number format करना
  static formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
    if (match) {
      return `+91 ${match[1]} ${match[2]} ${match[3]}`;
    }
    return phone;
  }

  // Generate unique ID - Unique ID generate करना
  static generateId(prefix = '') {
    return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Debounce function - Debounce function
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle function - Throttle function
  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Validate email - Email validate करना
  static validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Validate phone - Phone validate करना
  static validatePhone(phone) {
    const re = /^[6-9]\d{9}$/;
    return re.test(phone.replace(/\D/g, ''));
  }

  // Validate Indian phone - Indian phone validate करना
  static validateIndianPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 && /^[6-9]/.test(cleaned);
  }

  // Get distance between coordinates - Coordinates के बीच distance get करना
  static getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in kilometers
    return d;
  }

  // Convert degrees to radians - Degrees को radians में convert करना
  static deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  // Check if delivery area is within radius - Delivery area radius में है या नहीं check करना
  static isWithinDeliveryRadius(customerLat, customerLon, storeLat, storeLon, radiusKm = 5) {
    const distance = this.getDistance(customerLat, customerLon, storeLat, storeLon);
    return distance <= radiusKm;
  }

  // Format date - Date format करना
  static formatDate(date, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(date).toLocaleDateString('en-IN', { ...defaultOptions, ...options });
  }

  // Get time ago - Time ago get करना
  static getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return this.formatDate(date);
  }

  // Sanitize HTML - HTML sanitize करना
  static sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  }

  // Copy to clipboard - Clipboard में copy करना
  static async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch (err) {
        document.body.removeChild(textArea);
        return false;
      }
    }
  }

  // Download file - File download करना
  static downloadFile(data, filename, type = 'text/plain') {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Get query parameters - Query parameters get करना
  static getQueryParams() {
    const params = {};
    const searchParams = new URLSearchParams(window.location.search);
    for (const [key, value] of searchParams) {
      params[key] = value;
    }
    return params;
  }

  // Set query parameters - Query parameters set करना
  static setQueryParams(params) {
    const url = new URL(window.location);
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        url.searchParams.set(key, params[key]);
      } else {
        url.searchParams.delete(key);
      }
    });
    window.history.pushState({}, '', url);
  }

  // Check if device is mobile - Device mobile है या नहीं check करना
  static isMobile() {
    return window.innerWidth <= 768;
  }

  // Check if device is tablet - Device tablet है या नहीं check करना
  static isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
  }

  // Check if device is desktop - Device desktop है या नहीं check करना
  static isDesktop() {
    return window.innerWidth > 1024;
  }

  // Get device type - Device type get करना
  static getDeviceType() {
    if (this.isMobile()) return 'mobile';
    if (this.isTablet()) return 'tablet';
    return 'desktop';
  }

  // Show loading spinner - Loading spinner show करना
  static showLoading(element) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      element.innerHTML = `
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Loading...</p>
        </div>
      `;
    }
  }

  // Hide loading spinner - Loading spinner hide करना
  static hideLoading(element) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      const spinner = element.querySelector('.loading-spinner');
      if (spinner) {
        spinner.remove();
      }
    }
  }

  // Animate element - Element animate करना
  static animateElement(element, animation, duration = 300) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      element.style.animation = `${animation} ${duration}ms ease-in-out`;
      setTimeout(() => {
        element.style.animation = '';
      }, duration);
    }
  }

  // Scroll to element - Element पर scroll करना
  static scrollToElement(element, offset = 0) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  }

  // Get random color - Random color get करना
  static getRandomColor() {
    const colors = [
      '#ff6b35', '#fdcb6e', '#00b894', '#6c5ce7', 
      '#e17055', '#a29bfe', '#55efc4', '#fdcb6e'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Generate avatar - Avatar generate करना
  static generateAvatar(name, size = 40) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = this.getRandomColor();
    ctx.fillRect(0, 0, size, size);
    
    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = `${size/2}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name.charAt(0).toUpperCase(), size/2, size/2);
    
    return canvas.toDataURL();
  }
}

// Export for use in main app
window.Helpers = Helpers;
