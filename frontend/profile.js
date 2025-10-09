// Profile Manager - User profile management ka JavaScript
// Profile load, update, password change, avatar upload, account delete

class ProfileManager {
  constructor() {
    this.baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000/api'
      : '/api';
    
    this.user = null;
    this.token = localStorage.getItem('authToken');
    
    this.init();
  }

  // Initialize profile manager - Manager ko initialize karna
  async init() {
    // Check authentication - User logged in hai ya nahi
    if (!this.token) {
      window.location.href = 'login.html';
      return;
    }
    
    await this.loadProfile();
    this.setupEventListeners();
  }

  // Load user profile - User profile load karna
  async loadProfile() {
    try {
      const response = await fetch(`${this.baseUrl}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load profile');
      }
      
      const data = await response.json();
      
      if (data.success) {
        this.user = data.data;
        this.displayProfile();
      } else {
        throw new Error(data.error || 'Failed to load profile');
      }
    } catch (error) {
      console.error('Load profile error:', error);
      this.showToast('Failed to load profile', 'error');
      
      // If unauthorized, redirect to login
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = 'login.html';
      }
    }
  }

  // Display profile data - Profile data ko display karna
  displayProfile() {
    if (!this.user) return;
    
    // Avatar
    if (this.user.avatar) {
      document.getElementById('avatarImage').innerHTML = `<img src="${this.user.avatar}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
    }
    
    // Header info
    document.getElementById('displayName').textContent = this.user.name;
    document.getElementById('displayEmail').textContent = this.user.email;
    
    // Form fields
    document.getElementById('name').value = this.user.name || '';
    document.getElementById('email').value = this.user.email || '';
    document.getElementById('phone').value = this.user.phone || '';
    
    // Address fields
    if (this.user.address) {
      document.getElementById('street').value = this.user.address.street || '';
      document.getElementById('city').value = this.user.address.city || '';
      document.getElementById('state').value = this.user.address.state || '';
      document.getElementById('pincode').value = this.user.address.pincode || '';
    }
    
    // Stats
    document.getElementById('totalOrders').textContent = this.user.orderCount || 0;
    
    // Member since
    if (this.user.createdAt) {
      const year = new Date(this.user.createdAt).getFullYear();
      document.getElementById('memberSince').textContent = year;
    }
    
    // Last login
    if (this.user.lastLogin) {
      const lastLogin = new Date(this.user.lastLogin);
      document.getElementById('lastLogin').textContent = this.formatDate(lastLogin);
    }
  }

  // Setup event listeners - Event listeners setup karna
  setupEventListeners() {
    // Profile form submit
    document.getElementById('profileForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.updateProfile();
    });
    
    // Password form submit
    document.getElementById('passwordForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.changePassword();
    });
  }

  // Update profile - Profile update karna
  async updateProfile() {
    try {
      // Get form data
      const name = document.getElementById('name').value.trim();
      const street = document.getElementById('street').value.trim();
      const city = document.getElementById('city').value.trim();
      const state = document.getElementById('state').value.trim();
      const pincode = document.getElementById('pincode').value.trim();
      
      // Validate
      if (!name || name.length < 2) {
        this.showError('nameError', 'Name must be at least 2 characters');
        return;
      }
      
      // Prepare data
      const profileData = {
        name,
        address: {
          street,
          city,
          state,
          pincode
        }
      };
      
      // Send request
      const response = await fetch(`${this.baseUrl}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        this.user = data.data;
        this.displayProfile();
        this.showToast('Profile updated successfully!', 'success');
        
        // Update localStorage
        localStorage.setItem('userData', JSON.stringify(data.data));
      } else {
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      this.showToast(error.message || 'Failed to update profile', 'error');
    }
  }

  // Change password - Password change karna
  async changePassword() {
    try {
      // Clear previous errors
      this.clearErrors();
      
      // Get form data
      const currentPassword = document.getElementById('currentPassword').value;
      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      // Validate
      if (!currentPassword) {
        this.showError('currentPasswordError', 'Current password is required');
        return;
      }
      
      if (!newPassword || newPassword.length < 6) {
        this.showError('newPasswordError', 'Password must be at least 6 characters');
        return;
      }
      
      if (newPassword !== confirmPassword) {
        this.showError('confirmPasswordError', 'Passwords do not match');
        return;
      }
      
      if (currentPassword === newPassword) {
        this.showError('newPasswordError', 'New password must be different from current password');
        return;
      }
      
      // Send request
      const response = await fetch(`${this.baseUrl}/users/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Clear form
        document.getElementById('passwordForm').reset();
        this.showToast('Password changed successfully!', 'success');
      } else {
        throw new Error(data.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Change password error:', error);
      this.showToast(error.message || 'Failed to change password', 'error');
    }
  }

  // Upload avatar - Profile photo upload karna
  async uploadAvatar() {
    try {
      const fileInput = document.getElementById('avatarInput');
      const file = fileInput.files[0];
      
      if (!file) return;
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.showToast('Please select an image file', 'error');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.showToast('Image size should be less than 5MB', 'error');
        return;
      }
      
      // Create form data
      const formData = new FormData();
      formData.append('avatar', file);
      
      // Send request
      const response = await fetch(`${this.baseUrl}/users/avatar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        this.user.avatar = data.data.avatar;
        
        // Update avatar image
        document.getElementById('avatarImage').innerHTML = `<img src="${data.data.avatar}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        
        this.showToast('Profile photo updated!', 'success');
        
        // Update localStorage
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        userData.avatar = data.data.avatar;
        localStorage.setItem('userData', JSON.stringify(userData));
      } else {
        throw new Error(data.error || 'Failed to upload avatar');
      }
    } catch (error) {
      console.error('Upload avatar error:', error);
      this.showToast(error.message || 'Failed to upload photo', 'error');
    }
  }

  // Show delete modal - Delete confirmation modal dikhana
  showDeleteModal() {
    document.getElementById('deleteModal').classList.add('show');
  }

  // Hide delete modal - Modal band karna
  hideDeleteModal() {
    document.getElementById('deleteModal').classList.remove('show');
  }

  // Delete account - Account delete karna
  async deleteAccount() {
    try {
      const response = await fetch(`${this.baseUrl}/users/account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        this.showToast('Account deleted successfully', 'success');
        
        // Logout after 2 seconds
        setTimeout(() => {
          this.logout();
        }, 2000);
      } else {
        throw new Error(data.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Delete account error:', error);
      this.showToast(error.message || 'Failed to delete account', 'error');
      this.hideDeleteModal();
    }
  }

  // Logout - User ko logout karna
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = 'login.html';
  }

  // Show error message - Error message dikhana
  showError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('show');
    }
  }

  // Clear all errors - Sab errors clear karna
  clearErrors() {
    document.querySelectorAll('.form-error').forEach(el => {
      el.textContent = '';
      el.classList.remove('show');
    });
  }

  // Show toast notification - Toast message dikhana
  showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');
    const toastMessage = document.getElementById('toastMessage');
    
    toastIcon.textContent = type === 'success' ? '✅' : '❌';
    toastMessage.textContent = message;
    
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Format date - Date ko format karna
  formatDate(date) {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  }
}

// Initialize profile manager - Manager ko initialize karna
let profileManager;

document.addEventListener('DOMContentLoaded', () => {
  profileManager = new ProfileManager();
});
