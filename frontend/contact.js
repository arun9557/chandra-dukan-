// Contact Form Script - Contact form submit karna aur validate karna
// Form validation, API call, thank you message display

class ContactFormManager {
  constructor() {
    this.baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000/api'
      : '/api';
    
    this.init();
  }

  // Initialize contact form - Contact form initialize karna
  init() {
    const form = document.getElementById('contactForm');
    
    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Character counter for message - Message ke characters count karna
    const messageInput = document.getElementById('message');
    if (messageInput) {
      messageInput.addEventListener('input', () => this.updateCharCount());
    }

    // Real-time validation - Real-time validation lagana
    this.setupRealtimeValidation();

    // Update cart badge - Cart badge update karna
    this.updateCartBadge();
  }

  // Setup real-time validation - Real-time validation setup karna
  setupRealtimeValidation() {
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    if (nameInput) {
      nameInput.addEventListener('blur', () => this.validateName());
    }

    if (phoneInput) {
      phoneInput.addEventListener('blur', () => this.validatePhone());
      phoneInput.addEventListener('input', (e) => {
        // Only allow numbers - Sirf numbers allow karo
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
      });
    }

    if (emailInput) {
      emailInput.addEventListener('blur', () => this.validateEmail());
    }

    if (messageInput) {
      messageInput.addEventListener('blur', () => this.validateMessage());
    }
  }

  // Validate name - Name validate karna
  validateName() {
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('nameError');
    const name = nameInput.value.trim();

    if (!name) {
      this.showError(nameError, 'Name is required');
      return false;
    }

    if (name.length < 2) {
      this.showError(nameError, 'Name must be at least 2 characters');
      return false;
    }

    if (name.length > 100) {
      this.showError(nameError, 'Name cannot exceed 100 characters');
      return false;
    }

    this.hideError(nameError);
    return true;
  }

  // Validate phone - Phone number validate karna
  validatePhone() {
    const phoneInput = document.getElementById('phone');
    const phoneError = document.getElementById('phoneError');
    const phone = phoneInput.value.trim();

    if (!phone) {
      this.showError(phoneError, 'Phone number is required');
      return false;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      this.showError(phoneError, 'Enter a valid 10-digit Indian phone number');
      return false;
    }

    this.hideError(phoneError);
    return true;
  }

  // Validate email - Email validate karna (optional)
  validateEmail() {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const email = emailInput.value.trim();

    // Email is optional - Email optional hai
    if (!email) {
      this.hideError(emailError);
      return true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.showError(emailError, 'Enter a valid email address');
      return false;
    }

    this.hideError(emailError);
    return true;
  }

  // Validate message - Message validate karna
  validateMessage() {
    const messageInput = document.getElementById('message');
    const messageError = document.getElementById('messageError');
    const message = messageInput.value.trim();

    if (!message) {
      this.showError(messageError, 'Message is required');
      return false;
    }

    if (message.length < 10) {
      this.showError(messageError, 'Message must be at least 10 characters');
      return false;
    }

    if (message.length > 1000) {
      this.showError(messageError, 'Message cannot exceed 1000 characters');
      return false;
    }

    this.hideError(messageError);
    return true;
  }

  // Update character count - Character count update karna
  updateCharCount() {
    const messageInput = document.getElementById('message');
    const charCount = document.getElementById('charCount');

    if (messageInput && charCount) {
      const length = messageInput.value.length;
      charCount.textContent = length;

      // Change color based on limit - Limit ke basis pe color change karo
      if (length > 900) {
        charCount.style.color = '#dc2626';
      } else if (length > 700) {
        charCount.style.color = '#f59e0b';
      } else {
        charCount.style.color = '#6b7280';
      }
    }
  }

  // Handle form submission - Form submit handle karna
  async handleSubmit(e) {
    e.preventDefault();

    // Validate all fields - Sab fields validate karo
    const isNameValid = this.validateName();
    const isPhoneValid = this.validatePhone();
    const isEmailValid = this.validateEmail();
    const isMessageValid = this.validateMessage();

    if (!isNameValid || !isPhoneValid || !isEmailValid || !isMessageValid) {
      if (window.NotificationService) {
        window.NotificationService.show('Please fix the errors in the form', 'error');
      }
      return;
    }

    // Get form values - Form ki values le lo
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Show loading state - Loading state dikhao
    const submitBtn = document.getElementById('submitBtn');
    this.setButtonLoading(submitBtn, true);

    try {
      // Submit to API - API pe submit karo
      const response = await fetch(`${this.baseUrl}/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          phone,
          email: email || undefined,
          message,
          subject: 'general'
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Show thank you message - Thank you message dikhao
        this.showThankYouMessage();

        // Show notification - Notification dikhao
        if (window.NotificationService) {
          window.NotificationService.show('Message sent successfully!', 'success');
        }

      } else {
        throw new Error(data.error || 'Failed to send message');
      }

    } catch (error) {
      console.error('Contact form submission error:', error);
      
      if (window.NotificationService) {
        window.NotificationService.show(error.message, 'error');
      } else {
        alert(error.message);
      }

    } finally {
      this.setButtonLoading(submitBtn, false);
    }
  }

  // Show thank you message - Thank you message dikhana
  showThankYouMessage() {
    const form = document.getElementById('contactForm');
    const thankYouMessage = document.getElementById('thankYouMessage');

    if (form && thankYouMessage) {
      form.style.display = 'none';
      thankYouMessage.style.display = 'block';

      // Scroll to thank you message - Thank you message tak scroll karo
      thankYouMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // Show error message - Error message dikhana
  showError(errorElement, message) {
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      errorElement.previousElementSibling.classList.add('error');
    }
  }

  // Hide error message - Error message hide karna
  hideError(errorElement) {
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
      errorElement.previousElementSibling.classList.remove('error');
    }
  }

  // Set button loading state - Button loading state set karna
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

  // Update cart badge - Cart badge update karna
  updateCartBadge() {
    if (window.CartService) {
      const cart = window.CartService.getCart();
      const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      const badge = document.getElementById('cartBadge');
      if (badge) badge.textContent = count;
    }
  }
}

// Global function to reset form - Form reset karne ka global function
function resetForm() {
  const form = document.getElementById('contactForm');
  const thankYouMessage = document.getElementById('thankYouMessage');

  if (form && thankYouMessage) {
    form.reset();
    form.style.display = 'block';
    thankYouMessage.style.display = 'none';

    // Reset character count - Character count reset karo
    const charCount = document.getElementById('charCount');
    if (charCount) charCount.textContent = '0';

    // Scroll to form - Form tak scroll karo
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Initialize on page load - Page load hone pe initialize karo
document.addEventListener('DOMContentLoaded', () => {
  window.contactFormManager = new ContactFormManager();
});
