// Admin Dashboard JavaScript
// Dashboard data load aur display karne ke liye

const API_URL = 'http://localhost:3000/api';

// Page load hone par data fetch karo
document.addEventListener('DOMContentLoaded', async function() {
    await loadDashboardData();
    await loadRecentOrders();
    initializeCharts();
});

// Dashboard data load karna
async function loadDashboardData() {
    const token = localStorage.getItem('authToken');
    
    try {
        // Get analytics data
        const response = await fetch(`${API_URL}/orders/admin/analytics`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Update stats
            document.getElementById('totalOrders').textContent = data.data.totalOrders || 0;
            document.getElementById('totalRevenue').textContent = data.data.totalRevenue || 0;
        }

        // Get products count
        const productsRes = await fetch(`${API_URL}/products`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const productsData = await productsRes.json();
        if (productsData.success) {
            document.getElementById('totalProducts').textContent = productsData.total || 0;
        }

        // Get low stock count
        const lowStockRes = await fetch(`${API_URL}/products/inventory/low-stock`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const lowStockData = await lowStockRes.json();
        if (lowStockData.success) {
            document.getElementById('lowStockCount').textContent = lowStockData.data?.length || 0;
        }

    } catch (error) {
        console.error('Dashboard data load error:', error);
    }
}

// Recent orders load karna
async function loadRecentOrders() {
    const token = localStorage.getItem('authToken');
    
    try {
        const response = await fetch(`${API_URL}/orders/admin/today`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok && data.success) {
            displayRecentOrders(data.data);
        }

    } catch (error) {
        console.error('Recent orders load error:', error);
    }
}

// Recent orders display karna
function displayRecentOrders(orders) {
    const tbody = document.getElementById('recentOrdersTable');
    
    if (!orders || orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">No orders today</td></tr>';
        return;
    }

    tbody.innerHTML = orders.slice(0, 10).map(order => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">${order.orderNumber}</td>
            <td class="px-6 py-4 text-sm text-gray-500">${order.customerDetails.name}</td>
            <td class="px-6 py-4 text-sm text-gray-900">₹${order.pricing.total}</td>
            <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}">
                    ${order.status}
                </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">${new Date(order.createdAt).toLocaleDateString()}</td>
        </tr>
    `).join('');
}

// Status color get karna
function getStatusColor(status) {
    const colors = {
        'pending': 'bg-yellow-100 text-yellow-800',
        'confirmed': 'bg-blue-100 text-blue-800',
        'processing': 'bg-purple-100 text-purple-800',
        'shipped': 'bg-indigo-100 text-indigo-800',
        'delivered': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

// Charts initialize karna
function initializeCharts() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Sales (₹)',
                data: [1200, 1900, 3000, 2500, 2800, 3200, 4000],
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            }
        }
    });

    // Orders Chart
    const ordersCtx = document.getElementById('ordersChart').getContext('2d');
    new Chart(ordersCtx, {
        type: 'doughnut',
        data: {
            labels: ['Delivered', 'Processing', 'Pending', 'Cancelled'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: [
                    'rgb(34, 197, 94)',
                    'rgb(168, 85, 247)',
                    'rgb(234, 179, 8)',
                    'rgb(239, 68, 68)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

// Sidebar toggle karna (mobile ke liye)
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('hidden');
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '../frontend/login.html';
    }
}
