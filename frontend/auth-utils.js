// Authentication Utilities - Authentication helper functions

// Logout function
function logoutUser() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = 'login.html';
    }
}

// Check if user is logged in
function isLoggedIn() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    return !!(token && userData);
}

// Get current user
function getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

// Update auth UI on page load
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
        const user = JSON.parse(userData);
        
        // Update user menu
        const guestMenu = document.getElementById('guestMenu');
        const userMenu = document.getElementById('userMenu');
        const userMenuName = document.getElementById('userMenuName');
        
        if (guestMenu) guestMenu.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
        if (userMenuName) userMenuName.textContent = user.name;
    }
});
