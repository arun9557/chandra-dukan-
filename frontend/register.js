// Registration Script - Multi-step registration with OTP verification
// User registration ka complete process handle karna

class RegistrationManager {
  constructor() {
    this.baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000/api'
      : '/api';
    
    this.currentStep = 1;
    this.userData = {};
    this.otpTimer = null;
    this.resendTimer = null;
    this.otpExpiryTime = 600; // 10 minutes in seconds
    this.resendCooldown = 60; // 60 seconds
    
    this.init();
  }

  // Initialize registration manager
  init() {
    // Step 1: Account Info Form
    const accountInfoForm = document.getElementById('accountInfoForm');
    if (accountInfoForm) {
      accountInfoForm.addEventListener('submit', (e) => this.handleAccountInfoSubmit(e));
    }

    // Step 2: OTP Verification Form
    const otpForm = document.getElementById('otpVerificationForm');
    if (otpForm) {
      otpForm.addEventListener('submit', (e) => this.handleOtpSubmit(e));
    }

    // Password strength checker
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
      passwordInput.addEventListener('input', () => this.checkPasswordStrength());
    }

    // OTP inputs - Auto-focus next input
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && index < otpInputs.length - 1) {
          otpInputs[index + 1].focus();
        }
      });
      
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
          otpInputs[index - 1].focus();
        }
      });
    });

    // Resend OTP button
    const resendBtn = document.getElementById('resendOtpBtn');
    if (resendBtn) {
      resendBtn.addEventListener('click', () => this.resendOtp());
    }
  }

  // Step 1: Handle account info submission
  async handleAccountInfoSubmit(e) {
    e.preventDefault();

    // Clear previous errors
    this.clearErrors();

    // Get form values - Form ke values le lo
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;

    // Validate form - Form validate karo
    if (!this.validateAccountInfo(name, email, phone, password, confirmPassword, terms)) {
      return;
    }

    // Store user data temporarily - Data temporarily store karo
    this.userData = { name, email, phone, password };

    // Send OTP - OTP bhejna
    await this.sendOtp();
  }

  // Validate account information - Account info validate karna
  validateAccountInfo(name, email, phone, password, confirmPassword, terms) {
    let isValid = true;

    // Name validation
    if (!name || name.length < 2) {
      this.showError('nameError', 'Name must be at least 2 characters');
      isValid = false;
    }

    // Email or Phone validation
    if (!email && !phone) {
      this.showError('emailError', 'Provide either email or phone number');
      this.showError('phoneError', 'Provide either email or phone number');
      isValid = false;
    }

    if (email && !this.isValidEmail(email)) {
      this.showError('emailError', 'Invalid email format');
      isValid = false;
    }

    if (phone && !this.isValidPhone(phone)) {
      this.showError('phoneError', 'Invalid phone number (must be 10 digits starting with 6-9)');
      isValid = false;
    }

    // Password validation - Strong password check
    const passwordValidation = this.validatePassword(password);
    if (!passwordValidation.valid) {
      this.showError('passwordError', passwordValidation.message);
      isValid = false;
    }

    // Confirm password
    if (password !== confirmPassword) {
      this.showError('confirmPasswordError', 'Passwords do not match');
      isValid = false;
    }

    // Terms checkbox
    if (!terms) {
      if (window.NotificationService) {
        window.NotificationService.show('Please accept terms and conditions', 'error');
      } else {
        alert('Please accept terms and conditions');
      }
      isValid = false;
    }

    return isValid;
  }

  // Send OTP to email/phone - OTP bhejna
  async sendOtp() {
    const btn = document.getElementById('sendOtpBtn');
    this.setButtonLoading(btn, true);

    try {
      const response = await fetch(`${this.baseUrl}/auth/register/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: this.userData.email || undefined,
          phone: this.userData.phone || undefined
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Show OTP in development mode
        if (data.data.otp) {
          console.log(`DEV MODE - OTP: ${data.data.otp}`);
          if (window.NotificationService) {
            window.NotificationService.show(`DEV MODE - OTP: ${data.data.otp}`, 'info');
          }
        }

        // Move to OTP step - OTP step pe jao
        this.goToStep(2);
        this.startOtpTimer();
        this.startResendCooldown();

        // Update sent to text
        const sentTo = this.userData.email || this.userData.phone;
        document.getElementById('sentTo').textContent = sentTo;

        if (window.NotificationService) {
          window.NotificationService.show('OTP sent successfully!', 'success');
        }
      } else {
        throw new Error(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      if (window.NotificationService) {
        window.NotificationService.show(error.message, 'error');
      } else {
        alert(error.message);
      }
    } finally {
      this.setButtonLoading(btn, false);
    }
  }

  // Step 2: Handle OTP verification and registration
  async handleOtpSubmit(e) {
    e.preventDefault();

    // Get OTP from inputs - OTP inputs se OTP le lo
    const otp = this.getOtpValue();

    if (!otp || otp.length !== 6) {
      this.showError('otpError', 'Please enter complete 6-digit OTP');
      return;
    }

    const btn = document.getElementById('verifyOtpBtn');
    this.setButtonLoading(btn, true);
    document.getElementById('loadingOverlay').style.display = 'flex';

    try {
      const response = await fetch(`${this.baseUrl}/auth/register/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.userData.name,
          email: this.userData.email || undefined,
          phone: this.userData.phone || undefined,
          password: this.userData.password,
          otp: otp
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Registration successful! - Registration successful ho gayi!
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('userData', JSON.stringify(data.data.user));
        localStorage.setItem('refreshToken', data.data.refreshToken);

        if (window.NotificationService) {
          window.NotificationService.show('Registration successful! Welcome aboard!', 'success');
        }

        // Redirect to home page - Homepage pe redirect karo
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
      } else {
        throw new Error(data.error || 'OTP verification failed');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      this.showError('otpError', error.message);
      
      // Shake OTP inputs
      document.querySelectorAll('.otp-input').forEach(input => {
        input.classList.add('error');
        setTimeout(() => input.classList.remove('error'), 300);
      });

      document.getElementById('loadingOverlay').style.display = 'none';
    } finally {
      this.setButtonLoading(btn, false);
    }
  }

  // Resend OTP - OTP dubara bhejna
  async resendOtp() {
    const btn = document.getElementById('resendOtpBtn');
    btn.disabled = true;

    try {
      const response = await fetch(`${this.baseUrl}/auth/register/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: this.userData.email || undefined,
          phone: this.userData.phone || undefined
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Show OTP in development
        if (data.data.otp) {
          console.log(`DEV MODE - Resent OTP: ${data.data.otp}`);
          if (window.NotificationService) {
            window.NotificationService.show(`DEV MODE - OTP: ${data.data.otp}`, 'info');
          }
        }

        if (window.NotificationService) {
          window.NotificationService.show('OTP resent successfully!', 'success');
        }

        // Reset timers
        this.startOtpTimer();
        this.startResendCooldown();
      } else {
        throw new Error(data.error || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      if (window.NotificationService) {
        window.NotificationService.show(error.message, 'error');
      }
    }
  }

  // Get OTP value from inputs - Inputs se OTP value get karo
  getOtpValue() {
    let otp = '';
    for (let i = 1; i <= 6; i++) {
      const input = document.getElementById(`otp${i}`);
      otp += input.value;
    }
    return otp;
  }

  // Navigate to step - Step pe navigate karo
  goToStep(step) {
    this.currentStep = step;

    // Hide all steps
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'none';

    // Show current step
    document.getElementById(`step${step}`).style.display = 'block';

    // Update step indicators
    const indicators = document.querySelectorAll('.step-indicator');
    indicators.forEach((indicator, index) => {
      indicator.classList.remove('active', 'completed');
      if (index + 1 < step) {
        indicator.classList.add('completed');
      } else if (index + 1 === step) {
        indicator.classList.add('active');
      }
    });
  }

  // Start OTP expiry timer - OTP ki expiry timer start karo
  startOtpTimer() {
    if (this.otpTimer) clearInterval(this.otpTimer);

    let timeLeft = this.otpExpiryTime;
    const countdownElement = document.getElementById('otpCountdown');

    this.otpTimer = setInterval(() => {
      timeLeft--;
      
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      countdownElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

      if (timeLeft <= 0) {
        clearInterval(this.otpTimer);
        countdownElement.textContent = 'Expired';
        if (window.NotificationService) {
          window.NotificationService.show('OTP expired. Please request a new one.', 'warning');
        }
      }
    }, 1000);
  }

  // Start resend cooldown - Resend button ka cooldown start karo
  startResendCooldown() {
    const resendBtn = document.getElementById('resendOtpBtn');
    const timerSpan = document.getElementById('resendTimer');
    
    let timeLeft = this.resendCooldown;
    resendBtn.disabled = true;

    if (this.resendTimer) clearInterval(this.resendTimer);

    this.resendTimer = setInterval(() => {
      timeLeft--;
      timerSpan.textContent = `(${timeLeft}s)`;

      if (timeLeft <= 0) {
        clearInterval(this.resendTimer);
        resendBtn.disabled = false;
        timerSpan.textContent = '';
      }
    }, 1000);
  }

  // Password strength checker - Password ki strength check karo
  checkPasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthIndicator = document.getElementById('passwordStrength');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    if (!password) {
      strengthIndicator.style.display = 'none';
      return;
    }

    strengthIndicator.classList.add('show');
    
    const validation = this.validatePassword(password);
    const strength = validation.strength;

    // Update strength bar
    strengthFill.className = 'strength-fill ' + strength;
    strengthText.className = 'strength-text ' + strength;
    strengthText.textContent = strength.charAt(0).toUpperCase() + strength.slice(1);

    // Update requirements list
    document.getElementById('req-length').classList.toggle('met', password.length >= 8);
    document.getElementById('req-uppercase').classList.toggle('met', /[A-Z]/.test(password));
    document.getElementById('req-lowercase').classList.toggle('met', /[a-z]/.test(password));
    document.getElementById('req-number').classList.toggle('met', /\d/.test(password));
  }

  // Validate password strength - Password validate karo
  validatePassword(password) {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters', strength: 'weak' };
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUppercase || !hasLowercase || !hasNumber) {
      return { 
        valid: false, 
        message: 'Password must contain uppercase, lowercase, and number', 
        strength: hasLowercase && hasNumber ? 'medium' : 'weak'
      };
    }

    const strength = hasSpecial ? 'strong' : 'medium';
    return { valid: true, message: '', strength };
  }

  // Email validation - Email validate karo
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Phone validation - Phone validate karo
  isValidPhone(phone) {
    return /^[6-9]\d{9}$/.test(phone);
  }

  // Show error message - Error message dikhao
  showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('show');
      
      // Also add error class to input
      const inputId = elementId.replace('Error', '');
      const input = document.getElementById(inputId);
      if (input) input.classList.add('error');
    }
  }

  // Clear all errors - Sab errors clear karo
  clearErrors() {
    document.querySelectorAll('.form-error').forEach(el => {
      el.textContent = '';
      el.classList.remove('show');
    });
    
    document.querySelectorAll('.form-input').forEach(el => {
      el.classList.remove('error');
    });
  }

  // Set button loading state - Button loading state set karo
  setButtonLoading(button, loading) {
    const btnText = button.querySelector('.btn-text');
    const btnLoader = button.querySelector('.btn-loader');
    
    if (loading) {
      btnText.style.display = 'none';
      btnLoader.style.display = 'inline-block';
      button.disabled = true;
    } else {
      btnText.style.display = 'inline';
      btnLoader.style.display = 'none';
      button.disabled = false;
    }
  }
}

// Global function for password visibility toggle
function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  const button = input.nextElementSibling;
  
  if (input.type === 'password') {
    input.type = 'text';
    button.querySelector('.eye-icon').textContent = '🙈';
  } else {
    input.type = 'password';
    button.querySelector('.eye-icon').textContent = '👁️';
  }
}

// Global function for step navigation
function goToStep(step) {
  if (window.registrationManager) {
    window.registrationManager.goToStep(step);
  }
}

// Initialize on page load - Page load hone pe initialize karo
document.addEventListener('DOMContentLoaded', () => {
  window.registrationManager = new RegistrationManager();
});
