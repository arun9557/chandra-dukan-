// DataService - Data management service
// Data का management service

class DataService {
  constructor() {
    this.baseUrl = '/api'; // API base URL
    this.cache = new Map();
    this.init();
  }

  // Initialize data service - Data service initialize करना
  init() {
    this.loadAppData();
    this.setupStorageSync();
  }

  // Load app data - App data load करना
  loadAppData() {
    // Load from localStorage first
    const savedData = localStorage.getItem('chandraDukanData');
    if (savedData) {
      window.AppData = JSON.parse(savedData);
    } else {
      // Use default data
      window.AppData = this.getDefaultData();
      this.saveAppData();
    }
  }

  // Get default data - Default data get करना
  getDefaultData() {
    return {
      store: {
        name: "Chandra Dukan",
        owner: "Chandra Shekhar",
        phone: "+91 98765 43210",
        whatsapp: "+91 98765 43210",
        address: "Main Market, Village/Town",
        delivery_radius: "4-5 km",
        operating_hours: "7:00 AM - 10:00 PM",
        min_order: 100,
        free_delivery_above: 200
      },
      categories: [
        {
          id: 1,
          name: "Cold Drinks & Beverages",
          hindi_name: "Cold Drink aur Juice",
          icon: "🥤"
        },
        {
          id: 2, 
          name: "Namkeen & Snacks",
          hindi_name: "Namkeen aur Biscuit",
          icon: "🍪"
        },
        {
          id: 3,
          name: "Daily Essentials",
          hindi_name: "Rojana Saman",
          icon: "🛒"
        },
        {
          id: 4,
          name: "Dairy Products", 
          hindi_name: "Milk aur Eggs",
          icon: "🥛"
        },
        {
          id: 5,
          name: "Gas Cylinder",
          hindi_name: "Cooking Gas",
          icon: "🔥"
        },
        {
          id: 6,
          name: "Jan Seva Kendra",
          hindi_name: "Sarkari Services",
          icon: "📋"
        }
      ],
      products: [
        {
          id: 1,
          category_id: 1,
          name: "Coca Cola 600ml",
          price: 40,
          stock: 25,
          image: "https://via.placeholder.com/200x200?text=Coca+Cola"
        },
        {
          id: 2,
          category_id: 1, 
          name: "Pepsi 600ml",
          price: 40,
          stock: 20,
          image: "https://via.placeholder.com/200x200?text=Pepsi"
        },
        {
          id: 3,
          category_id: 1,
          name: "Sprite 600ml", 
          price: 40,
          stock: 15,
          image: "https://via.placeholder.com/200x200?text=Sprite"
        },
        {
          id: 4,
          category_id: 1,
          name: "Mango Juice 200ml",
          price: 25,
          stock: 30,
          image: "https://via.placeholder.com/200x200?text=Mango+Juice"
        },
        {
          id: 5,
          category_id: 2,
          name: "Lays Chips Classic",
          price: 20,
          stock: 40,
          image: "https://via.placeholder.com/200x200?text=Lays+Chips"
        },
        {
          id: 6,
          category_id: 2,
          name: "Kurkure Masala Munch", 
          price: 10,
          stock: 50,
          image: "https://via.placeholder.com/200x200?text=Kurkure"
        },
        {
          id: 7,
          category_id: 2,
          name: "Parle-G Biscuit",
          price: 15,
          stock: 35,
          image: "https://via.placeholder.com/200x200?text=Parle+G"
        },
        {
          id: 8,
          category_id: 2,
          name: "Good Day Biscuit",
          price: 25,
          stock: 25,
          image: "https://via.placeholder.com/200x200?text=Good+Day"
        },
        {
          id: 9,
          category_id: 3,
          name: "Toor Dal 1kg",
          price: 120,
          stock: 15,
          image: "https://via.placeholder.com/200x200?text=Toor+Dal"
        },
        {
          id: 10,
          category_id: 3,
          name: "Basmati Rice 5kg",
          price: 450,
          stock: 8,
          image: "https://via.placeholder.com/200x200?text=Basmati+Rice"
        },
        {
          id: 11,
          category_id: 3,
          name: "Mustard Oil 1L",
          price: 180,
          stock: 12,
          image: "https://via.placeholder.com/200x200?text=Mustard+Oil"
        },
        {
          id: 12,
          category_id: 3,
          name: "Wheat Flour 5kg", 
          price: 200,
          stock: 10,
          image: "https://via.placeholder.com/200x200?text=Wheat+Flour"
        },
        {
          id: 13,
          category_id: 4,
          name: "Amul Milk 500ml",
          price: 30,
          stock: 20,
          image: "https://via.placeholder.com/200x200?text=Amul+Milk"
        },
        {
          id: 14,
          category_id: 4,
          name: "Fresh Eggs (12 pcs)",
          price: 84,
          stock: 15,
          image: "https://via.placeholder.com/200x200?text=Fresh+Eggs"
        },
        {
          id: 15,
          category_id: 5,
          name: "Cooking Gas Cylinder 14.2kg",
          price: 950,
          stock: 5,
          image: "https://via.placeholder.com/200x200?text=Gas+Cylinder"
        },
        {
          id: 16,
          category_id: 6,
          name: "Aadhaar Print Service",
          price: 30,
          stock: 999,
          image: "https://via.placeholder.com/200x200?text=Aadhaar+Print"
        },
        {
          id: 17,
          category_id: 6,
          name: "PAN Card Service",
          price: 150,
          stock: 999,
          image: "https://via.placeholder.com/200x200?text=PAN+Card"
        }
      ],
      delivery_areas: [
        "Main Market Area",
        "Station Road", 
        "School Para",
        "Hospital Chowk",
        "Old Town",
        "New Colony"
      ]
    };
  }

  // Save app data - App data save करना
  saveAppData() {
    if (window.AppData) {
      localStorage.setItem('chandraDukanData', JSON.stringify(window.AppData));
    }
  }

  // Setup storage sync - Storage sync setup करना
  setupStorageSync() {
    // Sync data across tabs
    window.addEventListener('storage', (e) => {
      if (e.key === 'chandraDukanData') {
        window.AppData = JSON.parse(e.newValue);
        this.notifyDataChange();
      }
    });
  }

  // Notify data change - Data change notify करना
  notifyDataChange() {
    const event = new CustomEvent('dataChanged', {
      detail: { data: window.AppData }
    });
    document.dispatchEvent(event);
  }

  // Get products - Products get करना
  getProducts(filters = {}) {
    let products = [...(window.AppData?.products || [])];

    // Apply category filter
    if (filters.category) {
      products = products.filter(p => p.category_id == filters.category);
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sort
    if (filters.sort) {
      switch(filters.sort) {
        case 'price-low':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'stock':
          products.sort((a, b) => b.stock - a.stock);
          break;
        default:
          products.sort((a, b) => a.name.localeCompare(b.name));
      }
    }

    return products;
  }

  // Get categories - Categories get करना
  getCategories() {
    return window.AppData?.categories || [];
  }

  // Get store info - Store info get करना
  getStoreInfo() {
    return window.AppData?.store || {};
  }

  // Update product stock - Product stock update करना
  updateProductStock(productId, newStock) {
    if (window.AppData && window.AppData.products) {
      const product = window.AppData.products.find(p => p.id === productId);
      if (product) {
        product.stock = newStock;
        this.saveAppData();
        this.notifyDataChange();
        return true;
      }
    }
    return false;
  }

  // Add new product - New product add करना
  addProduct(productData) {
    if (window.AppData && window.AppData.products) {
      const newId = Math.max(...window.AppData.products.map(p => p.id)) + 1;
      const newProduct = {
        id: newId,
        ...productData,
        stock: productData.stock || 0
      };
      window.AppData.products.push(newProduct);
      this.saveAppData();
      this.notifyDataChange();
      return newProduct;
    }
    return null;
  }

  // Save order - Order save करना
  saveOrder(orderData) {
    const orders = JSON.parse(localStorage.getItem('chandraDukanOrders') || '[]');
    orders.push(orderData);
    localStorage.setItem('chandraDukanOrders', JSON.stringify(orders));
    
    // Update product stock
    orderData.items.forEach(item => {
      this.updateProductStock(item.id, -item.quantity);
    });
    
    return orderData;
  }

  // Get orders - Orders get करना
  getOrders(filters = {}) {
    const orders = JSON.parse(localStorage.getItem('chandraDukanOrders') || '[]');
    
    if (filters.status) {
      return orders.filter(order => order.status === filters.status);
    }
    
    if (filters.date) {
      const filterDate = new Date(filters.date).toDateString();
      return orders.filter(order => 
        new Date(order.timestamp).toDateString() === filterDate
      );
    }
    
    return orders;
  }

  // Export data - Data export करना
  exportData() {
    const data = {
      appData: window.AppData,
      orders: JSON.parse(localStorage.getItem('chandraDukanOrders') || '[]'),
      cart: JSON.parse(localStorage.getItem('chandraDukanCart') || '[]'),
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `chandra-dukan-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }

  // Import data - Data import करना
  importData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (data.appData) {
          window.AppData = data.appData;
          this.saveAppData();
        }
        
        if (data.orders) {
          localStorage.setItem('chandraDukanOrders', JSON.stringify(data.orders));
        }
        
        if (data.cart) {
          localStorage.setItem('chandraDukanCart', JSON.stringify(data.cart));
        }
        
        this.notifyDataChange();
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data: ' + error.message);
      }
    };
    reader.readAsText(file);
  }

  // Clear all data - All data clear करना
  clearAllData() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.removeItem('chandraDukanData');
      localStorage.removeItem('chandraDukanOrders');
      localStorage.removeItem('chandraDukanCart');
      localStorage.removeItem('notificationLogs');
      
      window.AppData = this.getDefaultData();
      this.saveAppData();
      this.notifyDataChange();
      
      alert('All data cleared successfully!');
    }
  }
}

// Export for use in main app
window.DataService = new DataService();
