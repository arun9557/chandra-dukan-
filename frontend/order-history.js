// Order History Script - User ka order history display aur manage karna
// Orders fetch, filter, details modal, invoice download

class OrderHistoryManager {
  constructor() {
    this.baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000/api'
      : '/api';
    
    this.orders = [];
    this.filteredOrders = [];
    this.currentFilters = {
      status: '',
      startDate: null,
      endDate: null
    };
    
    this.init();
  }

  // Initialize order history manager
  async init() {
    // Check if user is logged in - User logged in hai ya nahi check karo
    if (!this.checkAuth()) {
      window.location.href = 'login.html';
      return;
    }

    // Update cart badge
    this.updateCartBadge();

    // Setup event listeners
    this.setupEventListeners();

    // Load orders
    await this.loadOrders();
  }

  // Check authentication - Authentication check karna
  checkAuth() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    return !!(token && userData);
  }

  // Get current user - Current user ka data lena
  getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  // Setup event listeners - Event listeners setup karna
  setupEventListeners() {
    // Apply filters button
    const applyBtn = document.getElementById('applyFiltersBtn');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => this.applyFilters());
    }

    // Clear filters button
    const clearBtn = document.getElementById('clearFiltersBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearFilters());
    }

    // Status filter change
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
      statusFilter.addEventListener('change', () => this.applyFilters());
    }
  }

  // Load orders from API - Orders fetch karna
  async loadOrders() {
    try {
      this.showLoading();

      const user = this.getCurrentUser();
      if (!user || !user.id) {
        throw new Error('User not found');
      }

      const token = localStorage.getItem('authToken');
      const response = await fetch(`${this.baseUrl}/orders/user/${user.id}?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        this.orders = data.data || [];
        this.filteredOrders = [...this.orders];
        this.displayOrders();
        this.updateSummary();
      } else {
        throw new Error(data.error || 'Failed to load orders');
      }

    } catch (error) {
      console.error('Load orders error:', error);
      this.showError(error.message);
    }
  }

  // Display orders - Orders ko UI me dikhana
  displayOrders() {
    this.hideLoading();

    const ordersList = document.getElementById('ordersList');
    const emptyState = document.getElementById('ordersEmpty');

    if (this.filteredOrders.length === 0) {
      ordersList.style.display = 'none';
      emptyState.style.display = 'flex';
      return;
    }

    emptyState.style.display = 'none';
    ordersList.style.display = 'block';
    ordersList.innerHTML = this.filteredOrders.map(order => this.renderOrderCard(order)).join('');
  }

  // Render single order card - Ek order ka card HTML banana
  renderOrderCard(order) {
    const statusInfo = this.getStatusInfo(order.status);
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const orderTime = new Date(order.createdAt).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const itemsCount = order.items.length;
    const firstItems = order.items.slice(0, 2);
    const moreItemsCount = itemsCount > 2 ? itemsCount - 2 : 0;

    return `
      <div class="order-card" data-order-id="${order._id}">
        <div class="order-card-header">
          <div class="order-info-left">
            <h3 class="order-number">Order #${order.orderNumber}</h3>
            <p class="order-date">
              <span class="date-icon">📅</span>
              ${orderDate} at ${orderTime}
            </p>
          </div>
          <div class="order-status-badge ${statusInfo.className}">
            <span class="status-icon">${statusInfo.icon}</span>
            <span>${statusInfo.label}</span>
          </div>
        </div>

        <div class="order-card-body">
          <!-- Order Items Preview -->
          <div class="order-items-preview">
            ${firstItems.map(item => `
              <div class="order-item-preview">
                <img src="${item.image || 'https://via.placeholder.com/50'}" 
                     alt="${item.name}"
                     onerror="this.src='https://via.placeholder.com/50'">
                <div class="item-info">
                  <div class="item-name">${item.name}</div>
                  <div class="item-qty">Qty: ${item.quantity}</div>
                </div>
              </div>
            `).join('')}
            ${moreItemsCount > 0 ? `
              <div class="more-items">
                +${moreItemsCount} more item${moreItemsCount > 1 ? 's' : ''}
              </div>
            ` : ''}
          </div>

          <!-- Order Details -->
          <div class="order-details-row">
            <div class="order-detail">
              <span class="detail-label">Items:</span>
              <span class="detail-value">${itemsCount}</span>
            </div>
            <div class="order-detail">
              <span class="detail-label">Total:</span>
              <span class="detail-value total-amount">₹${order.pricing.total.toFixed(2)}</span>
            </div>
            <div class="order-detail">
              <span class="detail-label">Payment:</span>
              <span class="detail-value">${this.getPaymentMethodLabel(order.paymentMethod)}</span>
            </div>
          </div>
        </div>

        <div class="order-card-footer">
          <button class="btn-view-details" onclick="orderHistoryManager.viewOrderDetails('${order._id}')">
            <span>View Details</span>
          </button>
          
          ${this.canDownloadInvoice(order) ? `
            <button class="btn-download-invoice" onclick="orderHistoryManager.downloadInvoice('${order._id}')">
              <span class="btn-icon">📄</span>
              <span>Invoice</span>
            </button>
          ` : ''}
          
          ${this.canCancelOrder(order) ? `
            <button class="btn-cancel-order" onclick="orderHistoryManager.cancelOrder('${order._id}')">
              <span>Cancel Order</span>
            </button>
          ` : ''}
          
          ${order.status === 'delivered' && !order.rating ? `
            <button class="btn-rate-order" onclick="orderHistoryManager.rateOrder('${order._id}')">
              <span class="btn-icon">⭐</span>
              <span>Rate Order</span>
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }

  // Get status information - Status ki details lena
  getStatusInfo(status) {
    const statusMap = {
      pending: { label: 'Pending', icon: '⏳', className: 'status-pending' },
      confirmed: { label: 'Confirmed', icon: '✅', className: 'status-confirmed' },
      processing: { label: 'Processing', icon: '🔄', className: 'status-processing' },
      packed: { label: 'Packed', icon: '📦', className: 'status-packed' },
      shipped: { label: 'Shipped', icon: '🚚', className: 'status-shipped' },
      out_for_delivery: { label: 'Out for Delivery', icon: '🛵', className: 'status-out-for-delivery' },
      delivered: { label: 'Delivered', icon: '✅', className: 'status-delivered' },
      cancelled: { label: 'Cancelled', icon: '❌', className: 'status-cancelled' },
      returned: { label: 'Returned', icon: '↩️', className: 'status-returned' }
    };

    return statusMap[status] || { label: status, icon: '❓', className: 'status-unknown' };
  }

  // Get payment method label - Payment method ka label
  getPaymentMethodLabel(method) {
    const methodMap = {
      cod: 'Cash on Delivery',
      upi: 'UPI',
      phonepe: 'PhonePe',
      razorpay: 'Razorpay',
      card: 'Card',
      wallet: 'Wallet'
    };
    return methodMap[method] || method.toUpperCase();
  }

  // Check if invoice can be downloaded - Invoice download kar sakte hain ya nahi
  canDownloadInvoice(order) {
    return ['delivered', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery'].includes(order.status);
  }

  // Check if order can be cancelled - Order cancel kar sakte hain ya nahi
  canCancelOrder(order) {
    return ['pending', 'confirmed'].includes(order.status);
  }

  // View order details - Order details modal me dikhana
  async viewOrderDetails(orderId) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }

      const data = await response.json();

      if (data.success) {
        this.showOrderDetailsModal(data.data);
      } else {
        throw new Error(data.error);
      }

    } catch (error) {
      console.error('View order details error:', error);
      if (window.NotificationService) {
        window.NotificationService.show(error.message, 'error');
      } else {
        alert(error.message);
      }
    }
  }

  // Show order details modal - Order details modal dikhana
  showOrderDetailsModal(order) {
    const modal = document.getElementById('orderDetailsModal');
    const content = document.getElementById('orderDetailsContent');

    const statusInfo = this.getStatusInfo(order.status);
    const orderDate = new Date(order.createdAt).toLocaleString('en-IN');

    content.innerHTML = `
      <!-- Order Header -->
      <div class="modal-order-header">
        <div class="modal-order-number">
          <h3>Order #${order.orderNumber}</h3>
          <div class="order-status-badge ${statusInfo.className}">
            <span class="status-icon">${statusInfo.icon}</span>
            <span>${statusInfo.label}</span>
          </div>
        </div>
        <p class="modal-order-date">${orderDate}</p>
      </div>

      <!-- Order Items -->
      <div class="modal-section">
        <h4 class="modal-section-title">Order Items</h4>
        <div class="modal-items-list">
          ${order.items.map(item => `
            <div class="modal-order-item">
              <img src="${item.image || 'https://via.placeholder.com/60'}" 
                   alt="${item.name}"
                   onerror="this.src='https://via.placeholder.com/60'">
              <div class="modal-item-details">
                <div class="modal-item-name">${item.name}</div>
                <div class="modal-item-price">₹${item.price.toFixed(2)} × ${item.quantity}</div>
              </div>
              <div class="modal-item-subtotal">₹${item.subtotal.toFixed(2)}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Pricing Breakdown -->
      <div class="modal-section">
        <h4 class="modal-section-title">Pricing Details</h4>
        <div class="modal-pricing">
          <div class="pricing-row">
            <span>Subtotal</span>
            <span>₹${order.pricing.subtotal.toFixed(2)}</span>
          </div>
          <div class="pricing-row">
            <span>Delivery Charge</span>
            <span>${order.pricing.deliveryCharge > 0 ? '₹' + order.pricing.deliveryCharge.toFixed(2) : 'FREE'}</span>
          </div>
          ${order.pricing.discount > 0 ? `
            <div class="pricing-row discount">
              <span>Discount</span>
              <span>-₹${order.pricing.discount.toFixed(2)}</span>
            </div>
          ` : ''}
          ${order.pricing.tax > 0 ? `
            <div class="pricing-row">
              <span>Tax</span>
              <span>₹${order.pricing.tax.toFixed(2)}</span>
            </div>
          ` : ''}
          <div class="pricing-row total">
            <span>Total Amount</span>
            <span>₹${order.pricing.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <!-- Delivery Address -->
      <div class="modal-section">
        <h4 class="modal-section-title">Delivery Address</h4>
        <div class="modal-address">
          <p><strong>${order.customerDetails.name}</strong></p>
          <p>${order.customerDetails.phone}</p>
          ${order.customerDetails.email ? `<p>${order.customerDetails.email}</p>` : ''}
          <p>${order.customerDetails.address.street}</p>
          <p>${order.customerDetails.address.city}, ${order.customerDetails.address.pincode}</p>
          ${order.customerDetails.address.landmark ? `<p>Landmark: ${order.customerDetails.address.landmark}</p>` : ''}
        </div>
      </div>

      <!-- Payment Details -->
      <div class="modal-section">
        <h4 class="modal-section-title">Payment Information</h4>
        <div class="modal-payment">
          <div class="payment-row">
            <span>Payment Method</span>
            <span>${this.getPaymentMethodLabel(order.paymentMethod)}</span>
          </div>
          <div class="payment-row">
            <span>Payment Status</span>
            <span class="payment-status ${order.paymentStatus}">${order.paymentStatus.toUpperCase()}</span>
          </div>
          ${order.paymentDetails && order.paymentDetails.transactionId ? `
            <div class="payment-row">
              <span>Transaction ID</span>
              <span>${order.paymentDetails.transactionId}</span>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Order Status History -->
      ${order.statusHistory && order.statusHistory.length > 1 ? `
        <div class="modal-section">
          <h4 class="modal-section-title">Order Tracking</h4>
          <div class="status-timeline">
            ${order.statusHistory.map(history => {
              const historyStatus = this.getStatusInfo(history.status);
              const historyDate = new Date(history.timestamp).toLocaleString('en-IN');
              return `
                <div class="timeline-item">
                  <div class="timeline-icon ${historyStatus.className}">${historyStatus.icon}</div>
                  <div class="timeline-content">
                    <div class="timeline-title">${historyStatus.label}</div>
                    <div class="timeline-date">${historyDate}</div>
                    ${history.note ? `<div class="timeline-note">${history.note}</div>` : ''}
                  </div>
                </div>
              `;
            }).reverse().join('')}
          </div>
        </div>
      ` : ''}

      <!-- Notes -->
      ${order.notes ? `
        <div class="modal-section">
          <h4 class="modal-section-title">Order Notes</h4>
          <p class="modal-notes">${order.notes}</p>
        </div>
      ` : ''}

      <!-- Action Buttons -->
      <div class="modal-actions">
        ${this.canDownloadInvoice(order) ? `
          <button class="btn-primary" onclick="orderHistoryManager.downloadInvoice('${order._id}')">
            📄 Download Invoice
          </button>
        ` : ''}
        ${this.canCancelOrder(order) ? `
          <button class="btn-danger" onclick="orderHistoryManager.cancelOrder('${order._id}'); closeOrderModal();">
            Cancel Order
          </button>
        ` : ''}
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Download invoice - Invoice download karna
  downloadInvoice(orderId) {
    // Find order
    const order = this.orders.find(o => o._id === orderId);
    if (!order) {
      if (window.NotificationService) {
        window.NotificationService.show('Order not found', 'error');
      }
      return;
    }

    // Generate invoice HTML
    const invoiceHTML = this.generateInvoiceHTML(order);

    // Create a new window and print
    const printWindow = window.open('', '', 'height=800,width=800');
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();

    if (window.NotificationService) {
      window.NotificationService.show('Invoice downloaded successfully', 'success');
    }
  }

  // Generate invoice HTML - Invoice ka HTML generate karna
  generateInvoiceHTML(order) {
    const orderDate = new Date(order.createdAt).toLocaleString('en-IN');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order.orderNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .invoice-header { text-align: center; margin-bottom: 30px; }
          .invoice-header h1 { margin: 0; color: #667eea; }
          .invoice-info { margin-bottom: 20px; }
          .invoice-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .invoice-table th, .invoice-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          .invoice-table th { background-color: #667eea; color: white; }
          .total-row { font-weight: bold; background-color: #f3f4f6; }
          .address-section { margin: 20px 0; padding: 15px; background: #f9fafb; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <h1>🏪 Chandra Dukan</h1>
          <p>Nawalpur Beyora | Phone: +91 7465073957</p>
          <h2>INVOICE</h2>
        </div>

        <div class="invoice-info">
          <p><strong>Invoice Number:</strong> ${order.orderNumber}</p>
          <p><strong>Date:</strong> ${orderDate}</p>
          <p><strong>Payment Method:</strong> ${this.getPaymentMethodLabel(order.paymentMethod)}</p>
        </div>

        <div class="address-section">
          <h3>Delivery Address:</h3>
          <p>${order.customerDetails.name}<br>
          ${order.customerDetails.phone}<br>
          ${order.customerDetails.address.street}<br>
          ${order.customerDetails.address.city}, ${order.customerDetails.address.pincode}</p>
        </div>

        <table class="invoice-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>₹${item.subtotal.toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr>
              <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
              <td>₹${order.pricing.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: right;"><strong>Delivery Charge:</strong></td>
              <td>₹${order.pricing.deliveryCharge.toFixed(2)}</td>
            </tr>
            ${order.pricing.discount > 0 ? `
              <tr>
                <td colspan="3" style="text-align: right;"><strong>Discount:</strong></td>
                <td>-₹${order.pricing.discount.toFixed(2)}</td>
              </tr>
            ` : ''}
            <tr class="total-row">
              <td colspan="3" style="text-align: right;"><strong>Total Amount:</strong></td>
              <td><strong>₹${order.pricing.total.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>

        <p style="text-align: center; margin-top: 40px; color: #666;">
          Thank you for shopping with us!
        </p>
      </body>
      </html>
    `;
  }

  // Cancel order - Order cancel karna
  async cancelOrder(orderId) {
    const reason = prompt('Please enter cancellation reason:');
    if (!reason) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${this.baseUrl}/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      const data = await response.json();

      if (data.success) {
        if (window.NotificationService) {
          window.NotificationService.show('Order cancelled successfully', 'success');
        } else {
          alert('Order cancelled successfully');
        }
        await this.loadOrders();
      } else {
        throw new Error(data.error);
      }

    } catch (error) {
      console.error('Cancel order error:', error);
      if (window.NotificationService) {
        window.NotificationService.show(error.message, 'error');
      } else {
        alert(error.message);
      }
    }
  }

  // Rate order - Order ko rate karna
  rateOrder(orderId) {
    // TODO: Implement rating functionality
    alert('Rating feature coming soon!');
  }

  // Apply filters - Filters apply karna
  applyFilters() {
    const statusFilter = document.getElementById('statusFilter').value;
    const startDate = document.getElementById('startDateFilter').value;
    const endDate = document.getElementById('endDateFilter').value;

    this.currentFilters = {
      status: statusFilter,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null
    };

    // Filter orders
    this.filteredOrders = this.orders.filter(order => {
      // Status filter
      if (this.currentFilters.status && order.status !== this.currentFilters.status) {
        return false;
      }

      // Date range filter
      const orderDate = new Date(order.createdAt);
      if (this.currentFilters.startDate && orderDate < this.currentFilters.startDate) {
        return false;
      }
      if (this.currentFilters.endDate) {
        const endOfDay = new Date(this.currentFilters.endDate);
        endOfDay.setHours(23, 59, 59, 999);
        if (orderDate > endOfDay) {
          return false;
        }
      }

      return true;
    });

    this.displayOrders();
    this.updateSummary();
  }

  // Clear filters - Filters clear karna
  clearFilters() {
    document.getElementById('statusFilter').value = '';
    document.getElementById('startDateFilter').value = '';
    document.getElementById('endDateFilter').value = '';

    this.currentFilters = {
      status: '',
      startDate: null,
      endDate: null
    };

    this.filteredOrders = [...this.orders];
    this.displayOrders();
    this.updateSummary();
  }

  // Update summary cards - Summary cards update karna
  updateSummary() {
    const totalOrders = this.filteredOrders.length;
    const delivered = this.filteredOrders.filter(o => o.status === 'delivered').length;
    const cancelled = this.filteredOrders.filter(o => o.status === 'cancelled').length;
    const active = this.filteredOrders.filter(o => 
      !['delivered', 'cancelled', 'returned'].includes(o.status)
    ).length;

    document.getElementById('totalOrdersCount').textContent = totalOrders;
    document.getElementById('deliveredCount').textContent = delivered;
    document.getElementById('cancelledCount').textContent = cancelled;
    document.getElementById('activeCount').textContent = active;
  }

  // Show loading state - Loading state dikhana
  showLoading() {
    document.getElementById('ordersLoading').style.display = 'flex';
    document.getElementById('ordersList').style.display = 'none';
    document.getElementById('ordersEmpty').style.display = 'none';
    document.getElementById('ordersError').style.display = 'none';
  }

  // Hide loading state - Loading state hide karna
  hideLoading() {
    document.getElementById('ordersLoading').style.display = 'none';
  }

  // Show error state - Error state dikhana
  showError(message) {
    this.hideLoading();
    document.getElementById('ordersError').style.display = 'flex';
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('ordersList').style.display = 'none';
    document.getElementById('ordersEmpty').style.display = 'none';
  }

  // Update cart badge - Cart badge update karna
  updateCartBadge() {
    if (window.CartService) {
      const cart = window.CartService.getCart();
      const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      const badge = document.getElementById('cartBadge');
      if (badge) badge.textContent = count;
    }
  }
}

// Global function to close order modal
function closeOrderModal() {
  const modal = document.getElementById('orderDetailsModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.id === 'orderDetailsModal') {
    closeOrderModal();
  }
});

// Initialize on page load - Page load pe initialize karo
document.addEventListener('DOMContentLoaded', () => {
  window.orderHistoryManager = new OrderHistoryManager();
});
