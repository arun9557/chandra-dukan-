// Register functionality - Registration handle करना

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

// Register handler function
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!validateForm(name, email, phone, password, confirmPassword)) {
        return;
    }
    
    processRegister(name, email, phone, password);
}

// Form validation
function validateForm(name, email, phone, password, confirmPassword) {
    if (!name || !email || !phone || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
        alert('Please enter a valid 10-digit Indian phone number');
        return false;
    }
    
    // Password validation
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return false;
    }
    
    // Confirm password
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return false;
    }
    
    return true;
}

// Register process - Backend se connect karna
async function processRegister(name, email, phone, password) {
    console.log('Register attempt with:', { name, email, phone });
    
    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                phone,
                password
            })
        });
        
        const data = await response.json();
        
        submitBtn.textContent = 'Create Account';
        submitBtn.disabled = false;
        
        if (response.ok && data.success) {
            // Save token and user data
            localStorage.setItem('authToken', data.data.token);
            localStorage.setItem('userData', JSON.stringify(data.data.user));
            
            alert('Registration successful! Redirecting...');
            
            // Redirect based on user role
            setTimeout(() => {
                if (data.data.user.role === 'admin') {
                    window.location.href = '../admin/dashboard.html';
                } else {
                    window.location.href = 'index.html';
                }
            }, 1000);
        } else {
            alert(data.error || 'Registration failed. Please try again.');
        }
    } catch (error) {
        submitBtn.textContent = 'Create Account';
        submitBtn.disabled = false;
        
        console.error('Registration error:', error);
        alert('Network error. Please check if backend is running on port 3000.');
    }
}
