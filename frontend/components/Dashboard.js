// Dashboard Component - Store owner dashboard का component
// Order management, inventory, and analytics

class Dashboard {
  constructor() {
    this.isOpen = false;
    this.orders = [];
    this.analytics = {
      totalOrders: 0,
      totalRevenue: 0,
      todayOrders: 0,
      todayRevenue: 0
    };
  }

  // Initialize dashboard - Dashboard initialize करना
  init() {
    this.render();
    this.setupEventListeners();
    this.loadDashboardData();
  }

  // Render dashboard HTML - Dashboard का HTML render करना
  render() {
    const dashboardHTML = `
      <div class="modal hidden" id="dashboardModal">
        <div class="modal-backdrop" id="dashboardModalBackdrop"></div>
        <div class="modal-content dashboard-content">
          <div class="modal-header">
            <h3>📊 Store Dashboard - दुकान का डैशबोर्ड</h3>
            <button class="modal-close" id="closeDashboardModal">×</button>
          </div>
          <div class="modal-body">
            <div class="dashboard-tabs">
              <button class="tab-btn active" data-tab="overview">Overview</button>
              <button class="tab-btn" data-tab="orders">Orders</button>
              <button class="tab-btn" data-tab="inventory">Inventory</button>
              <button class="tab-btn" data-tab="analytics">Analytics</button>
            </div>
            
            <div class="tab-content" id="overviewTab">
              <div class="dashboard-cards">
                <div class="dashboard-card">
                  <div class="card-icon">📦</div>
                  <div class="card-content">
                    <h4>Total Orders</h4>
                    <p id="totalOrders">0</p>
                  </div>
                </div>
                <div class="dashboard-card">
                  <div class="card-icon">💰</div>
                  <div class="card-content">
                    <h4>Total Revenue</h4>
                    <p id="totalRevenue">₹0</p>
                  </div>
                </div>
                <div class="dashboard-card">
                  <div class="card-icon">📅</div>
                  <div class="card-content">
                    <h4>Today's Orders</h4>
                    <p id="todayOrders">0</p>
                  </div>
                </div>
                <div class="dashboard-card">
                  <div class="card-icon">💵</div>
                  <div class="card-content">
                    <h4>Today's Revenue</h4>
                    <p id="todayRevenue">₹0</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="tab-content hidden" id="ordersTab">
              <div class="orders-section">
                <h4>Recent Orders - हाल के Orders</h4>
                <div class="orders-list" id="ordersList">
                  <!-- Orders will be loaded here -->
                </div>
              </div>
            </div>
            
            <div class="tab-content hidden" id="inventoryTab">
              <div class="inventory-section">
                <h4>Inventory Management - स्टॉक प्रबंधन</h4>
                <div class="inventory-controls">
                  <button class="btn btn--primary" id="updateInventoryBtn">
                    Update Inventory
                  </button>
                  <button class="btn btn--outline" id="addProductBtn">
                    Add Product
                  </button>
                </div>
                <div class="inventory-list" id="inventoryList">
                  <!-- Inventory will be loaded here -->
                </div>
              </div>
            </div>
            
            <div class="tab-content hidden" id="analyticsTab">
              <div class="analytics-section">
                <h4>Sales Analytics - बिक्री विश्लेषण</h4>
                <div class="analytics-charts">
                  <div class="chart-container">
                    <h5>Daily Sales</h5>
                    <div class="chart-placeholder" id="dailySalesChart">
                      📊 Daily Sales Chart
                    </div>
                  </div>
                  <div class="chart-container">
                    <h5>Top Products</h5>
                    <div class="chart-placeholder" id="topProductsChart">
                      📈 Top Products Chart
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn--secondary" id="closeDashboardBtn">
              Close Dashboard
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', dashboardHTML);
  }

  // Setup event listeners - Event listeners setup करना
  setupEventListeners() {
    const closeBtn = document.getElementById('closeDashboardModal');
    const backdrop = document.getElementById('dashboardModalBackdrop');
    const closeDashboardBtn = document.getElementById('closeDashboardBtn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const updateInventoryBtn = document.getElementById('updateInventoryBtn');
    const addProductBtn = document.getElementById('addProductBtn');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    if (backdrop) {
      backdrop.addEventListener('click', () => this.close());
    }

    if (closeDashboardBtn) {
      closeDashboardBtn.addEventListener('click', () => this.close());
    }

    // Tab switching
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });

    if (updateInventoryBtn) {
      updateInventoryBtn.addEventListener('click', () => this.updateInventory());
    }

    if (addProductBtn) {
      addProductBtn.addEventListener('click', () => this.addProduct());
    }
  }

  // Open dashboard - Dashboard open करना
  open() {
    const modal = document.getElementById('dashboardModal');
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      this.isOpen = true;
      this.loadDashboardData();
    }
  }

  // Close dashboard - Dashboard close करना
  close() {
    const modal = document.getElementById('dashboardModal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
      this.isOpen = false;
    }
  }

  // Switch tab - Tab switch करना
  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.add('hidden');
    });
    document.getElementById(`${tabName}Tab`).classList.remove('hidden');

    // Load tab-specific data
    switch(tabName) {
      case 'orders':
        this.loadOrders();
        break;
      case 'inventory':
        this.loadInventory();
        break;
      case 'analytics':
        this.loadAnalytics();
        break;
    }
  }

  // Load dashboard data - Dashboard data load करना
  loadDashboardData() {
    // Load from localStorage or API
    const savedOrders = localStorage.getItem('chandraDukanOrders');
    this.orders = savedOrders ? JSON.parse(savedOrders) : [];
    
    this.calculateAnalytics();
    this.updateOverviewCards();
  }

  // Calculate analytics - Analytics calculate करना
  calculateAnalytics() {
    const today = new Date().toDateString();
    
    this.analytics.totalOrders = this.orders.length;
    this.analytics.totalRevenue = this.orders.reduce((sum, order) => sum + order.total, 0);
    this.analytics.todayOrders = this.orders.filter(order => 
      new Date(order.timestamp).toDateString() === today
    ).length;
    this.analytics.todayRevenue = this.orders.filter(order => 
      new Date(order.timestamp).toDateString() === today
    ).reduce((sum, order) => sum + order.total, 0);
  }

  // Update overview cards - Overview cards update करना
  updateOverviewCards() {
    document.getElementById('totalOrders').textContent = this.analytics.totalOrders;
    document.getElementById('totalRevenue').textContent = `₹${this.analytics.totalRevenue}`;
    document.getElementById('todayOrders').textContent = this.analytics.todayOrders;
    document.getElementById('todayRevenue').textContent = `₹${this.analytics.todayRevenue}`;
  }

  // Load orders - Orders load करना
  loadOrders() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;

    if (this.orders.length === 0) {
      ordersList.innerHTML = `
        <div class="empty-state">
          <p>No orders yet</p>
        </div>
      `;
      return;
    }

    ordersList.innerHTML = '';
    this.orders.slice(0, 10).forEach(order => {
      const orderElement = this.createOrderElement(order);
      ordersList.appendChild(orderElement);
    });
  }

  // Create order element - Order element create करना
  createOrderElement(order) {
    const orderElement = document.createElement('div');
    orderElement.className = 'order-item';
    orderElement.innerHTML = `
      <div class="order-header">
        <span class="order-id">#${order.id}</span>
        <span class="order-status status-${order.status}">${order.status}</span>
        <span class="order-total">₹${order.total}</span>
      </div>
      <div class="order-details">
        <p><strong>Customer:</strong> ${order.customer.name}</p>
        <p><strong>Phone:</strong> ${order.customer.phone}</p>
        <p><strong>Area:</strong> ${order.customer.area}</p>
        <p><strong>Items:</strong> ${order.items.length} items</p>
        <p><strong>Time:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
      </div>
      <div class="order-actions">
        <button class="btn btn--sm" onclick="Dashboard.updateOrderStatus('${order.id}', 'processing')">
          Process
        </button>
        <button class="btn btn--sm" onclick="Dashboard.updateOrderStatus('${order.id}', 'delivered')">
          Delivered
        </button>
      </div>
    `;
    return orderElement;
  }

  // Load inventory - Inventory load करना
  loadInventory() {
    const inventoryList = document.getElementById('inventoryList');
    if (!inventoryList) return;

    const products = window.AppData?.products || [];
    
    inventoryList.innerHTML = '';
    products.forEach(product => {
      const inventoryElement = this.createInventoryElement(product);
      inventoryList.appendChild(inventoryElement);
    });
  }

  // Create inventory element - Inventory element create करना
  createInventoryElement(product) {
    const inventoryElement = document.createElement('div');
    inventoryElement.className = 'inventory-item';
    inventoryElement.innerHTML = `
      <div class="product-info">
        <h5>${product.name}</h5>
        <p>Price: ₹${product.price}</p>
      </div>
      <div class="stock-info">
        <span class="stock-count">${product.stock}</span>
        <button class="btn btn--sm" onclick="Dashboard.updateStock(${product.id})">
          Update
        </button>
      </div>
    `;
    return inventoryElement;
  }

  // Load analytics - Analytics load करना
  loadAnalytics() {
    // Simple analytics display
    const dailySalesChart = document.getElementById('dailySalesChart');
    const topProductsChart = document.getElementById('topProductsChart');
    
    if (dailySalesChart) {
      dailySalesChart.innerHTML = `
        <div class="analytics-placeholder">
          <p>📊 Daily Sales: ₹${this.analytics.todayRevenue}</p>
          <p>📈 Growth: +15% from yesterday</p>
        </div>
      `;
    }
    
    if (topProductsChart) {
      topProductsChart.innerHTML = `
        <div class="analytics-placeholder">
          <p>🥇 Top Product: Coca Cola</p>
          <p>📊 Total Sales: 25 units</p>
        </div>
      `;
    }
  }

  // Update order status - Order status update करना
  static updateOrderStatus(orderId, status) {
    const orders = JSON.parse(localStorage.getItem('chandraDukanOrders') || '[]');
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
      orders[orderIndex].status = status;
      localStorage.setItem('chandraDukanOrders', JSON.stringify(orders));
      
      // Refresh dashboard if open
      if (window.Dashboard && window.Dashboard.isOpen) {
        window.Dashboard.loadOrders();
      }
    }
  }

  // Update stock - Stock update करना
  static updateStock(productId) {
    const newStock = prompt('Enter new stock quantity:');
    if (newStock && !isNaN(newStock)) {
      // Update in app data
      if (window.AppData && window.AppData.products) {
        const product = window.AppData.products.find(p => p.id === productId);
        if (product) {
          product.stock = parseInt(newStock);
          // Save to localStorage
          localStorage.setItem('chandraDukanProducts', JSON.stringify(window.AppData.products));
        }
      }
      
      // Refresh inventory if dashboard is open
      if (window.Dashboard && window.Dashboard.isOpen) {
        window.Dashboard.loadInventory();
      }
    }
  }

  // Update inventory - Inventory update करना
  updateInventory() {
    alert('Inventory update feature coming soon!');
  }

  // Add product - Product add करना
  addProduct() {
    alert('Add product feature coming soon!');
  }
}

// Export for use in main app
window.Dashboard = Dashboard;
