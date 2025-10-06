// Website Upgrades - Modern Features JavaScript

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initUpgrades();
    initScrollEffects();
    initCountdownTimers();
    initSkeletonLoading();
    checkDarkMode();
});

// ==================== MAIN INITIALIZATION ====================
function initUpgrades() {
    console.log('🚀 Website upgrades loaded successfully!');
    
    // Update cart badge
    updateCartBadge();
    
    // Setup event listeners
    setupEventListeners();
    
    // Populate category filter
    setTimeout(() => {
        populateCategoryFilter();
    }, 500);
}

// Populate category filter dropdown
function populateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter) return;
    
    // Get categories from DataService
    if (window.DataService) {
        const categories = window.DataService.getCategories();
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
    }
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Header search input
    const headerSearch = document.getElementById('headerSearchInput');
    if (headerSearch) {
        headerSearch.addEventListener('input', (e) => {
            handleHeaderSearch(e.target.value);
        });
        
        headerSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleHeaderSearch(e.target.value);
            }
        });
    }
    
    // Header search button
    const searchBtn = document.querySelector('.header-search .search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const input = document.getElementById('headerSearchInput');
            if (input) {
                handleHeaderSearch(input.value);
            }
        });
    }
    
    // Sync main search with header search
    const mainSearchInput = document.getElementById('searchInput');
    if (mainSearchInput) {
        mainSearchInput.addEventListener('input', (e) => {
            const headerInput = document.getElementById('headerSearchInput');
            if (headerInput && headerInput.value !== e.target.value) {
                headerInput.value = e.target.value;
            }
        });
    }
    
    // Category filter in header
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            const event = new CustomEvent('productUpdate', {
                detail: {
                    search: '',
                    category: e.target.value,
                    sort: document.getElementById('sortFilter')?.value || 'name'
                }
            });
            document.dispatchEvent(event);
        });
    }
    
    // Sort filter in header
    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) {
        sortFilter.addEventListener('change', (e) => {
            const event = new CustomEvent('productUpdate', {
                detail: {
                    search: document.getElementById('headerSearchInput')?.value || '',
                    category: document.getElementById('categoryFilter')?.value || '',
                    sort: e.target.value
                }
            });
            document.dispatchEvent(event);
        });
    }
}

// ==================== HEADER FUNCTIONS ====================
function openLocationModal() {
    alert('Location selector coming soon! Currently serving: Nawalpur Beyora');
    // TODO: Implement location modal
}

function openDeliveryAreaMap() {
    // Open delivery area map in new tab
    window.open('delivery-map.html', '_blank');
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userMenuDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const container = event.target.closest('.user-menu-container');
        if (!container) {
            dropdown?.classList.remove('show');
        }
    });
}

function toggleMobileMenu() {
    const header = document.querySelector('.modern-header');
    header.classList.toggle('mobile-menu-open');
    // TODO: Implement mobile menu
}

function handleHeaderSearch(query) {
    // Sync with main search
    const mainSearch = document.getElementById('searchInput');
    if (mainSearch) {
        mainSearch.value = query;
    }
    
    // Trigger search through SearchBar component
    if (window.SearchBar && window.App && window.App.components && window.App.components.searchBar) {
        window.App.components.searchBar.currentSearch = query;
        window.App.components.searchBar.triggerProductUpdate();
    }
    
    // Fallback: trigger custom event
    const event = new CustomEvent('productUpdate', {
        detail: {
            search: query,
            category: '',
            sort: document.getElementById('sortFilter')?.value || 'name'
        }
    });
    document.dispatchEvent(event);
}

// ==================== CART FUNCTIONS ====================
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge && window.CartService) {
        const cart = window.CartService.getCart();
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = itemCount;
        badge.style.display = itemCount > 0 ? 'block' : 'none';
    }
}

function openCart() {
    // Trigger cart modal from main app
    if (window.CartModal && window.CartModal.open) {
        window.CartModal.open();
    } else {
        alert('Cart functionality loading...');
    }
}

// Update cart badge when cart changes
if (window.CartService) {
    const originalAddToCart = window.CartService.addToCart;
    window.CartService.addToCart = function(...args) {
        const result = originalAddToCart.apply(this, args);
        updateCartBadge();
        return result;
    };
    
    const originalRemoveFromCart = window.CartService.removeFromCart;
    window.CartService.removeFromCart = function(...args) {
        const result = originalRemoveFromCart.apply(this, args);
        updateCartBadge();
        return result;
    };
}

// ==================== DARK MODE ====================
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    
    // Update icon
    const icon = document.querySelector('.dark-mode-toggle .action-icon');
    if (icon) {
        icon.textContent = isDark ? '☀️' : '🌙';
    }
    
    // Show notification
    showNotification(isDark ? 'Dark mode enabled' : 'Light mode enabled');
}

function checkDarkMode() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        const icon = document.querySelector('.dark-mode-toggle .action-icon');
        if (icon) {
            icon.textContent = '☀️';
        }
    }
}

// ==================== SCROLL EFFECTS ====================
function initScrollEffects() {
    // Header scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const header = document.getElementById('mainHeader');
        
        if (header) {
            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        // Back to top button
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            if (currentScroll > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
        
        lastScroll = currentScroll;
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ==================== COUNTDOWN TIMERS ====================
function initCountdownTimers() {
    // Set end time (24 hours from now)
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 24);
    
    updateCountdown('offerTimer1', endTime);
    
    // Update every second
    setInterval(() => {
        updateCountdown('offerTimer1', endTime);
    }, 1000);
}

function updateCountdown(elementId, endTime) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const now = new Date().getTime();
    const distance = endTime - now;
    
    if (distance < 0) {
        element.querySelector('.timer-value').textContent = 'EXPIRED';
        return;
    }
    
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    const timerValue = element.querySelector('.timer-value');
    if (timerValue) {
        timerValue.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
}

function pad(num) {
    return num.toString().padStart(2, '0');
}

// ==================== SKELETON LOADING ====================
function initSkeletonLoading() {
    // Show skeleton, hide after products load
    const skeleton = document.getElementById('productsSkeleton');
    const productsGrid = document.getElementById('productsGrid');
    
    if (skeleton && productsGrid) {
        // Wait for products to load
        const checkProducts = setInterval(() => {
            if (productsGrid.children.length > 0) {
                skeleton.style.display = 'none';
                productsGrid.style.display = 'grid';
                clearInterval(checkProducts);
            }
        }, 100);
        
        // Timeout after 5 seconds
        setTimeout(() => {
            skeleton.style.display = 'none';
            productsGrid.style.display = 'grid';
            clearInterval(checkProducts);
        }, 5000);
    }
}

// ==================== NEWSLETTER ====================
function subscribeNewsletter(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    
    // TODO: Send to backend
    console.log('Newsletter subscription:', email);
    
    showNotification('✅ Successfully subscribed to newsletter!');
    form.reset();
}

// ==================== NOTIFICATIONS ====================
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ==================== LAZY LOADING ====================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==================== PERFORMANCE MONITORING ====================
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            console.log('Performance:', entry.name, entry.duration + 'ms');
        }
    });
    observer.observe({ entryTypes: ['measure', 'navigation'] });
}

// ==================== EXPORT FUNCTIONS ====================
window.UpgradeFeatures = {
    toggleDarkMode,
    openLocationModal,
    toggleUserMenu,
    toggleMobileMenu,
    openCart,
    subscribeNewsletter,
    scrollToTop,
    showNotification,
    updateCartBadge
};

console.log('✨ All upgrade features initialized!');
