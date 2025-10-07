// Login functionality - Login functionality handle करना

// DOM loaded होने का wait करना
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

// Login handler function
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!validateForm(email, password)) {
        return;
    }
    
    processLogin(email, password);
}

// Form validation function
function validateForm(email, password) {
    if (!email || !password) {
        showError('Please fill in all fields');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address');
        return false;
    }
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters long');
        return false;
    }
    
    return true;
}

// Login process function - Backend se connect karna
async function processLogin(email, password) {
    console.log('Login attempt with:', { email });
    
    showLoading(true);
    
    try {
        // Backend API call
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        showLoading(false);
        
        if (response.ok && data.success) {
            // Save token and user data
            localStorage.setItem('authToken', data.data.token);
            localStorage.setItem('userData', JSON.stringify(data.data.user));
            
            // Direct redirect without any message
            if (data.data.user.role === 'admin') {
                window.location.replace('http://localhost:8002/dashboard.html');
            } else {
                window.location.replace('index.html');
            }
        } else {
            showError(data.error || 'Login failed. Please check your credentials.');
        }
    } catch (error) {
        showLoading(false);
        console.error('Login error:', error);
        showError('Network error. Please check if backend is running on port 3000.');
    }
}

// Error message show करने का function
function showError(message) {
    alert(message);
}

// Success message show करने का function
function showSuccess(message) {
    alert(message);
}

// Loading state show/hide करने का function
function showLoading(show) {
    const loginButton = document.querySelector('button[type="submit"]');
    if (loginButton) {
        if (show) {
            loginButton.setAttribute('data-original-text', loginButton.textContent);
            loginButton.textContent = 'Logging in...';
            loginButton.disabled = true;
        } else {
            const originalText = loginButton.getAttribute('data-original-text') || 'Log in';
            loginButton.textContent = originalText;
            loginButton.disabled = false;
        }
    }
}
