// Account Management - खाता प्रबंधन

const API_URL = 'http://localhost:3000/api';
let currentUser = null;

// Check authentication on page load
document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (!token || !userData) {
        alert('Please login first');
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = JSON.parse(userData);
    loadUserData();
    loadOrders();
    
    // Form submissions
    document.getElementById('profileForm').addEventListener('submit', updateProfile);
    document.getElementById('addressForm').addEventListener('submit', updateAddress);
    document.getElementById('passwordForm').addEventListener('submit', changePassword);
});

// Load user data
function loadUserData() {
    if (!currentUser) return;
    
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('profileName').value = currentUser.name;
    document.getElementById('profileEmail').value = currentUser.email;
    document.getElementById('profilePhone').value = currentUser.phone;
    
    // Load address if exists
    if (currentUser.address) {
        document.getElementById('addressStreet').value = currentUser.address.street || '';
        document.getElementById('addressCity').value = currentUser.address.city || '';
        document.getElementById('addressState').value = currentUser.address.state || '';
        document.getElementById('addressPincode').value = currentUser.address.pincode || '';
        document.getElementById('addressLandmark').value = currentUser.address.landmark || '';
    }
}

// Tab switching
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('bg-indigo-100', 'text-indigo-700');
    });
    
    // Show selected tab
    const tabs = {
        'profile': 'profileTab',
        'orders': 'ordersTab',
        'addresses': 'addressesTab',
        'security': 'securityTab'
    };
    
    document.getElementById(tabs[tabName]).classList.remove('hidden');
    
    // Add active class to clicked button
    event.target.classList.add('bg-indigo-100', 'text-indigo-700');
}

// Update profile
async function updateProfile(e) {
    e.preventDefault();
    
    const name = document.getElementById('profileName').value;
    const phone = document.getElementById('profilePhone').value;
    const token = localStorage.getItem('authToken');
    
    try {
        const response = await fetch(`${API_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, phone })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            currentUser = data.data;
            localStorage.setItem('userData', JSON.stringify(currentUser));
            alert('Profile updated successfully!');
            loadUserData();
        } else {
            alert(data.error || 'Failed to update profile');
        }
    } catch (error) {
        console.error('Update error:', error);
        alert('Network error. Please try again.');
    }
}

// Update address
async function updateAddress(e) {
    e.preventDefault();
    
    const address = {
        street: document.getElementById('addressStreet').value,
        city: document.getElementById('addressCity').value,
        state: document.getElementById('addressState').value,
        pincode: document.getElementById('addressPincode').value,
        landmark: document.getElementById('addressLandmark').value
    };
    
    const token = localStorage.getItem('authToken');
    
    try {
        const response = await fetch(`${API_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ address })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            currentUser = data.data;
            localStorage.setItem('userData', JSON.stringify(currentUser));
            alert('Address saved successfully!');
        } else {
            alert(data.error || 'Failed to save address');
        }
    } catch (error) {
        console.error('Update error:', error);
        alert('Network error. Please try again.');
    }
}

// Change password
async function changePassword(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match!');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    const token = localStorage.getItem('authToken');
    
    try {
        // First verify current password by logging in
        const loginResponse = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: currentUser.email,
                password: currentPassword
            })
        });
        
        if (!loginResponse.ok) {
            alert('Current password is incorrect');
            return;
        }
        
        // Update password (you'll need to add this endpoint)
        alert('Password change functionality will be added to backend');
        document.getElementById('passwordForm').reset();
        
    } catch (error) {
        console.error('Password change error:', error);
        alert('Network error. Please try again.');
    }
}

// Load orders
async function loadOrders() {
    const token = localStorage.getItem('authToken');
    const ordersList = document.getElementById('ordersList');
    
    try {
        const response = await fetch(`${API_URL}/orders?userId=${currentUser.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.data && data.data.length > 0) {
                ordersList.innerHTML = data.data.map(order => `
                    <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <h4 class="font-semibold text-gray-800">Order #${order.orderNumber || order._id}</h4>
                                <p class="text-sm text-gray-500">${new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <span class="px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}">
                                ${order.status}
                            </span>
                        </div>
                        <p class="text-lg font-semibold text-indigo-600">₹${order.pricing?.total || order.totalAmount}</p>
                        <p class="text-sm text-gray-600 mt-2">${order.items?.length || 0} items</p>
                    </div>
                `).join('');
            } else {
                ordersList.innerHTML = '<p class="text-gray-500 text-center py-8">No orders yet</p>';
            }
        } else {
            ordersList.innerHTML = '<p class="text-gray-500 text-center py-8">No orders found</p>';
        }
    } catch (error) {
        console.error('Load orders error:', error);
        ordersList.innerHTML = '<p class="text-gray-500 text-center py-8">Failed to load orders</p>';
    }
}

// Get status color
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

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = 'login.html';
    }
}
