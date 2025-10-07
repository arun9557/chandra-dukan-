// Admin Authentication Check
// Admin access verify karne ke liye

document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
});

// Admin authentication check karna
function checkAdminAuth() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');

    // Agar token ya user data nahi hai
    if (!token || !userData) {
        alert('Please login first');
        window.location.href = '../frontend/login.html';
        return;
    }

    const user = JSON.parse(userData);

    // Check if user is admin
    if (user.role !== 'admin') {
        alert('Access denied. Admin only area.');
        window.location.href = '../frontend/index.html';
        return;
    }

    // Display admin info
    const adminName = document.getElementById('adminName');
    const adminInitial = document.getElementById('adminInitial');
    
    if (adminName) adminName.textContent = user.name;
    if (adminInitial) adminInitial.textContent = user.name.charAt(0).toUpperCase();
}

// API call with auth token
async function apiCall(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };

    return fetch(endpoint, mergedOptions);
}
