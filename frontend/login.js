// Login functionality - Login functionality handle करना

// DOM loaded होने का wait करना
document.addEventListener('DOMContentLoaded', function() {
    // Login form element get करना
    const loginForm = document.getElementById('loginForm');
    
    // Form submit event listener add करना
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

// Login handler function - Login handle करने का function
function handleLogin(e) {
    e.preventDefault();
    
    // Email aur password fields get करना
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validation perform करना
    if (!validateForm(email, password)) {
        return;
    }
    
    // Login process start करना
    processLogin(email, password);
}

// Form validation function - Form validation करने का function
function validateForm(email, password) {
    // Required fields check करना
    if (!email || !password) {
        showError('Please fill in all fields');
        return false;
    }
    
    // Email format validation - Email format validate करना
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address');
        return false;
    }
    
    // Password length validation - Password length validate करना
    if (password.length < 6) {
        showError('Password must be at least 6 characters long');
        return false;
    }
    
    return true;
}

// Login process function - Login process करने का function
function processLogin(email, password) {
    // Login attempt logging - Login attempt log करना
    console.log('Login attempt with:', { email, password });
    
    // Show loading state - Loading state show करना
    showLoading(true);
    
    // Simulate API call - API call simulate करना
    setTimeout(() => {
        // Loading state hide करना
        showLoading(false);
        
        // Success message show करना
        showSuccess('Login successful! Redirecting to dashboard...');
        
        // Redirect to main app after delay - Delay के बाद main app पर redirect करना
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 1500);
}

// Error message show करने का function
function showError(message) {
    // Alert के माध्यम से error message show करना
    alert(message);
    
    // Alternative: Create a custom error message element
    // Custom error message element create करना (optional)
    /*
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #ef4444;
        background-color: #fee2e2;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 15px;
        text-align: center;
    `;
    
    // Insert before form - Form से पहले insert करना
    const form = document.getElementById('loginForm');
    form.parentNode.insertBefore(errorElement, form);
    
    // Auto remove after 5 seconds - 5 सेकंड के बाद auto remove करना
    setTimeout(() => {
        if (errorElement.parentNode) {
            errorElement.parentNode.removeChild(errorElement);
        }
    }, 5000);
    */
}

// Success message show करने का function
function showSuccess(message) {
    // Alert के माध्यम से success message show करना
    alert(message);
    
    // Alternative: Create a custom success message element
    // Custom success message element create करना (optional)
    /*
    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.textContent = message;
    successElement.style.cssText = `
        color: #10b981;
        background-color: #d1fae5;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 15px;
        text-align: center;
    `;
    
    // Insert before form - Form से पहले insert करना
    const form = document.getElementById('loginForm');
    form.parentNode.insertBefore(successElement, form);
    
    // Auto remove after 5 seconds - 5 सेकंड के बाद auto remove करना
    setTimeout(() => {
        if (successElement.parentNode) {
            successElement.parentNode.removeChild(successElement);
        }
    }, 5000);
    */
}

// Loading state show/hide करने का function
function showLoading(show) {
    const loginButton = document.querySelector('button[type="submit"]');
    if (loginButton) {
        if (show) {
            // Save original text - Original text save करना
            loginButton.setAttribute('data-original-text', loginButton.textContent);
            loginButton.textContent = 'Logging in...';
            loginButton.disabled = true;
        } else {
            // Restore original text - Original text restore करना
            const originalText = loginButton.getAttribute('data-original-text') || 'Log in';
            loginButton.textContent = originalText;
            loginButton.disabled = false;
        }
    }
}