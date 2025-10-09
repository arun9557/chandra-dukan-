// FAQ Page Manager - FAQ page ka JavaScript
// FAQ load karna, search, filter, accordion functionality

class FAQManager {
  constructor() {
    this.baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000/api'
      : '/api';
    
    this.faqs = [];
    this.filteredFaqs = [];
    this.currentCategory = 'all';
    
    this.init();
  }

  // Initialize FAQ page - Page ko initialize karna
  async init() {
    await this.loadFAQs();
    this.updateCartBadge();
  }

  // Load FAQs from backend - Backend se FAQs load karna
  async loadFAQs() {
    try {
      this.showLoading();
      
      // Try to fetch from backend
      const response = await fetch(`${this.baseUrl}/faq`);
      
      if (response.ok) {
        const data = await response.json();
        this.faqs = data.data || [];
      } else {
        // Fallback to default FAQs
        this.faqs = this.getDefaultFAQs();
      }
    } catch (error) {
      console.error('Error loading FAQs:', error);
      // Use default FAQs if API fails
      this.faqs = this.getDefaultFAQs();
    }
    
    this.filteredFaqs = this.faqs;
    this.renderFAQs();
    this.hideLoading();
  }

  // Get default FAQs - Default FAQ data
  getDefaultFAQs() {
    return [
      // Orders Category
      {
        category: 'orders',
        question: 'How do I place an order?',
        question_hi: 'मैं ऑर्डर कैसे करूं?',
        answer: 'Browse products, add items to cart, proceed to checkout, select delivery address and payment method, then confirm your order.',
        isActive: true
      },
      {
        category: 'orders',
        question: 'Can I modify my order after placing it?',
        question_hi: 'क्या मैं ऑर्डर देने के बाद उसे बदल सकता हूं?',
        answer: 'Yes, you can modify your order within 10 minutes of placing it. Contact us immediately on WhatsApp or call us.',
        isActive: true
      },
      {
        category: 'orders',
        question: 'How do I track my order?',
        question_hi: 'मैं अपने ऑर्डर को कैसे ट्रैक करूं?',
        answer: 'Go to "My Orders" section in your account. Click on any order to see detailed tracking information and current status.',
        isActive: true
      },
      {
        category: 'orders',
        question: 'What is the minimum order value?',
        question_hi: 'न्यूनतम ऑर्डर मूल्य क्या है?',
        answer: 'There is no minimum order value. However, orders above ₹500 get free delivery.',
        isActive: true
      },
      
      // Payment Category
      {
        category: 'payment',
        question: 'What payment methods do you accept?',
        question_hi: 'आप कौन से भुगतान तरीके स्वीकार करते हैं?',
        answer: 'We accept Cash on Delivery (COD), UPI, Credit/Debit Cards, PhonePe, Google Pay, and all major digital wallets.',
        isActive: true
      },
      {
        category: 'payment',
        question: 'Is it safe to pay online?',
        question_hi: 'क्या ऑनलाइन भुगतान सुरक्षित है?',
        answer: 'Yes, absolutely! All online payments are processed through secure payment gateways with 256-bit SSL encryption.',
        isActive: true
      },
      {
        category: 'payment',
        question: 'When will I receive my refund?',
        question_hi: 'मुझे रिफंड कब मिलेगा?',
        answer: 'Refunds are processed within 5-7 business days. The amount will be credited to your original payment source.',
        isActive: true
      },
      {
        category: 'payment',
        question: 'Do you charge extra for COD?',
        question_hi: 'क्या COD के लिए अतिरिक्त शुल्क है?',
        answer: 'No, Cash on Delivery is completely free. We don\'t charge any extra fees for COD orders.',
        isActive: true
      },
      
      // Delivery Category
      {
        category: 'delivery',
        question: 'What are your delivery hours?',
        question_hi: 'आपके डिलीवरी के घंटे क्या हैं?',
        answer: 'We deliver from 8 AM to 8 PM, all 7 days a week including Sundays and holidays.',
        isActive: true
      },
      {
        category: 'delivery',
        question: 'Do you offer same-day delivery?',
        question_hi: 'क्या आप same-day delivery देते हैं?',
        answer: 'Yes! Orders placed before 2 PM are delivered the same day. Orders after 2 PM are delivered next day.',
        isActive: true
      },
      {
        category: 'delivery',
        question: 'What is the delivery charge?',
        question_hi: 'डिलीवरी चार्ज क्या है?',
        answer: 'Delivery charge is ₹40 for orders below ₹500. Orders above ₹500 get FREE delivery.',
        isActive: true
      },
      {
        category: 'delivery',
        question: 'Do you deliver to my area?',
        question_hi: 'क्या आप मेरे इलाके में डिलीवर करते हैं?',
        answer: 'We currently deliver in Nawalpur Beyora and surrounding areas. Check availability by entering your pincode at checkout.',
        isActive: true
      },
      
      // Returns Category
      {
        category: 'returns',
        question: 'What is your return policy?',
        question_hi: 'आपकी रिटर्न पॉलिसी क्या है?',
        answer: 'We offer hassle-free returns within 24 hours of delivery if you\'re not satisfied with product quality.',
        isActive: true
      },
      {
        category: 'returns',
        question: 'How do I return a product?',
        question_hi: 'मैं उत्पाद कैसे वापस करूं?',
        answer: 'Contact us via WhatsApp or call within 24 hours of delivery. Our delivery person will pick up the product during the next delivery.',
        isActive: true
      },
      {
        category: 'returns',
        question: 'Which products can be returned?',
        question_hi: 'कौन से उत्पाद वापस किए जा सकते हैं?',
        answer: 'All packaged products can be returned if unopened. Fresh produce can be returned only if there\'s a quality issue.',
        isActive: true
      },
      
      // Account Category
      {
        category: 'account',
        question: 'How do I create an account?',
        question_hi: 'मैं खाता कैसे बनाऊं?',
        answer: 'Click on "Sign Up" button, enter your name, phone number, and create a password. You\'ll receive an OTP for verification.',
        isActive: true
      },
      {
        category: 'account',
        question: 'I forgot my password. What should I do?',
        question_hi: 'मैं अपना पासवर्ड भूल गया। मुझे क्या करना चाहिए?',
        answer: 'Click on "Forgot Password" on the login page. Enter your registered phone number and follow the OTP verification process.',
        isActive: true
      },
      {
        category: 'account',
        question: 'Can I have multiple delivery addresses?',
        question_hi: 'क्या मैं कई डिलीवरी पते रख सकता हूं?',
        answer: 'Yes, you can save multiple addresses in your account. Select the desired address during checkout.',
        isActive: true
      },
      
      // Jan Seva Kendra
      {
        category: 'jan-seva',
        question: 'What is Jan Seva Kendra?',
        question_hi: 'जन सेवा केंद्र क्या है?',
        answer: 'Jan Seva Kendra offers government services like Aadhaar, PAN card, passport applications, bill payments, and more at our store.',
        isActive: true
      },
      {
        category: 'jan-seva',
        question: 'What services are available?',
        question_hi: 'कौन सी सेवाएं उपलब्ध हैं?',
        answer: 'Aadhaar enrollment/update, PAN card application, passport services, electricity/water bill payments, mobile recharge, banking services, and more.',
        isActive: true
      },
      {
        category: 'jan-seva',
        question: 'What documents do I need?',
        question_hi: 'मुझे कौन से दस्तावेज़ चाहिए?',
        answer: 'Required documents vary by service. Generally, you\'ll need ID proof (Aadhaar/PAN), address proof, and photographs. Contact us for specific requirements.',
        isActive: true
      }
    ];
  }

  // Render FAQs - FAQs ko display karna
  renderFAQs() {
    const container = document.getElementById('faqContent');
    const noResults = document.getElementById('noResults');
    
    if (this.filteredFaqs.length === 0) {
      container.innerHTML = '';
      noResults.style.display = 'block';
      return;
    }
    
    noResults.style.display = 'none';
    
    // Group FAQs by category
    const grouped = this.groupByCategory(this.filteredFaqs);
    
    let html = '';
    
    for (const [category, faqs] of Object.entries(grouped)) {
      const categoryInfo = this.getCategoryInfo(category);
      
      html += `
        <div class="faq-section">
          <h2 class="section-title">
            <span>${categoryInfo.icon}</span>
            <span>${categoryInfo.name}</span>
          </h2>
          <div class="faq-list">
            ${faqs.map((faq, index) => this.renderFAQItem(faq, index)).join('')}
          </div>
        </div>
      `;
    }
    
    container.innerHTML = html;
  }

  // Render single FAQ item - Ek FAQ item ka HTML
  renderFAQItem(faq, index) {
    return `
      <div class="faq-item" id="faq-${index}">
        <div class="faq-question" onclick="faqManager.toggleFAQ(${index})">
          <span class="faq-question-text">${faq.question}</span>
          <span class="faq-icon">▼</span>
        </div>
        <div class="faq-answer">
          <div class="faq-answer-content">
            ${faq.question_hi ? `<p style="font-weight: 600; color: #6366F1; margin-bottom: 0.5rem;">${faq.question_hi}</p>` : ''}
            <p>${faq.answer}</p>
          </div>
        </div>
      </div>
    `;
  }

  // Toggle FAQ accordion - FAQ ko open/close karna
  toggleFAQ(index) {
    const faqItem = document.getElementById(`faq-${index}`);
    if (faqItem) {
      const isOpen = faqItem.classList.contains('open');
      
      // Close all other FAQs (optional - remove to allow multiple open)
      document.querySelectorAll('.faq-item.open').forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('open');
        }
      });
      
      // Toggle current FAQ
      if (isOpen) {
        faqItem.classList.remove('open');
      } else {
        faqItem.classList.add('open');
      }
    }
  }

  // Group FAQs by category - Category wise group karna
  groupByCategory(faqs) {
    const grouped = {};
    
    faqs.forEach(faq => {
      const category = faq.category || 'general';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(faq);
    });
    
    return grouped;
  }

  // Get category info - Category ka info
  getCategoryInfo(category) {
    const categories = {
      'orders': { name: 'Orders & Shopping', icon: '📦' },
      'payment': { name: 'Payment & Billing', icon: '💳' },
      'delivery': { name: 'Delivery & Shipping', icon: '🚚' },
      'returns': { name: 'Returns & Refunds', icon: '↩️' },
      'account': { name: 'Account & Profile', icon: '👤' },
      'jan-seva': { name: 'Jan Seva Kendra', icon: '📋' },
      'general': { name: 'General', icon: '❓' }
    };
    
    return categories[category] || categories.general;
  }

  // Filter by category - Category se filter karna
  filterByCategory(category) {
    this.currentCategory = category;
    
    // Update tab active state
    document.querySelectorAll('.category-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter FAQs
    if (category === 'all') {
      this.filteredFaqs = this.faqs;
    } else {
      this.filteredFaqs = this.faqs.filter(faq => faq.category === category);
    }
    
    this.renderFAQs();
  }

  // Search FAQs - FAQs me search karna
  searchFAQs(query) {
    query = query.toLowerCase().trim();
    
    if (!query) {
      this.filteredFaqs = this.faqs;
      this.renderFAQs();
      return;
    }
    
    this.filteredFaqs = this.faqs.filter(faq => {
      return faq.question.toLowerCase().includes(query) ||
             faq.answer.toLowerCase().includes(query) ||
             (faq.question_hi && faq.question_hi.includes(query));
    });
    
    this.renderFAQs();
  }

  // Show loading state
  showLoading() {
    document.getElementById('loadingState').style.display = 'block';
    document.getElementById('faqContent').style.display = 'none';
  }

  // Hide loading state
  hideLoading() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('faqContent').style.display = 'block';
  }

  // Update cart badge
  updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const badge = document.getElementById('cartBadge');
    if (badge) badge.textContent = count;
  }
}

// Initialize FAQ manager - Manager ko initialize karna
let faqManager;

document.addEventListener('DOMContentLoaded', () => {
  faqManager = new FAQManager();
});

// Global functions - Global functions
function filterCategory(category) {
  faqManager.filterByCategory(category);
}

function searchFAQ() {
  const query = document.getElementById('faqSearch').value;
  faqManager.searchFAQs(query);
}
