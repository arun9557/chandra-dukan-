// Jan Seva Kendra - Main Application Logic

const API_URL = 'http://localhost:3000/api';

// Services Data
let allServices = [];
let filteredServices = [];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadServices();
    setupEventListeners();
});

// Load Services from Backend
async function loadServices() {
    try {
        const response = await fetch(`${API_URL}/janseva/services`);
        const data = await response.json();
        
        if (data.success) {
            allServices = data.data;
            filteredServices = allServices;
            renderServices();
        } else {
            // Fallback to local data if backend not available
            allServices = getLocalServices();
            filteredServices = allServices;
            renderServices();
        }
    } catch (error) {
        console.log('Using local services data');
        allServices = getLocalServices();
        filteredServices = allServices;
        renderServices();
    }
}

// Get Local Services Data (Fallback)
function getLocalServices() {
    return [
        {
            id: 'caste-certificate',
            name: 'Caste Certificate',
            nameHindi: 'जाति प्रमाण पत्र',
            icon: '📜',
            category: 'certificates',
            price: 50,
            processingTime: '5-7 days',
            description: 'Apply for caste certificate online',
            popular: true,
            requiredDocs: ['Aadhar Card', 'Address Proof', 'Previous Certificate (if any)']
        },
        {
            id: 'income-certificate',
            name: 'Income Certificate',
            nameHindi: 'आय प्रमाण पत्र',
            icon: '💰',
            category: 'certificates',
            price: 50,
            processingTime: '5-7 days',
            description: 'Apply for income certificate',
            popular: true,
            requiredDocs: ['Aadhar Card', 'Salary Slip', 'Bank Statement']
        },
        {
            id: 'birth-certificate',
            name: 'Birth Certificate',
            nameHindi: 'जन्म प्रमाण पत्र',
            icon: '👶',
            category: 'certificates',
            price: 30,
            processingTime: '3-5 days',
            description: 'Apply for birth certificate',
            popular: true,
            requiredDocs: ['Hospital Certificate', 'Parents Aadhar', 'Address Proof']
        },
        {
            id: 'domicile-certificate',
            name: 'Domicile Certificate',
            nameHindi: 'निवास प्रमाण पत्र',
            icon: '🏠',
            category: 'certificates',
            price: 50,
            processingTime: '7-10 days',
            description: 'Apply for domicile certificate',
            popular: true,
            requiredDocs: ['Aadhar Card', 'Ration Card', 'Electricity Bill']
        },
        {
            id: 'pan-card',
            name: 'PAN Card',
            nameHindi: 'पैन कार्ड',
            icon: '💳',
            category: 'cards',
            price: 100,
            processingTime: '10-15 days',
            description: 'Apply for new PAN card',
            popular: true,
            requiredDocs: ['Aadhar Card', 'Photo', 'Address Proof']
        },
        {
            id: 'aadhar-update',
            name: 'Aadhar Update',
            nameHindi: 'आधार अपडेट',
            icon: '🆔',
            category: 'cards',
            price: 50,
            processingTime: '5-7 days',
            description: 'Update Aadhar details',
            popular: true,
            requiredDocs: ['Existing Aadhar', 'Updated Documents']
        },
        {
            id: 'pension-registration',
            name: 'Pension Registration',
            nameHindi: 'पेंशन पंजीकरण',
            icon: '👴',
            category: 'welfare',
            price: 0,
            processingTime: '15-20 days',
            description: 'Register for pension scheme',
            popular: false,
            requiredDocs: ['Age Proof', 'Income Certificate', 'Bank Details']
        },
        {
            id: 'scholarship',
            name: 'Scholarship Application',
            nameHindi: 'छात्रवृत्ति आवेदन',
            icon: '🎓',
            category: 'welfare',
            price: 0,
            processingTime: '20-30 days',
            description: 'Apply for scholarship',
            popular: false,
            requiredDocs: ['Marksheet', 'Income Certificate', 'Bank Details']
        },
        {
            id: 'voter-id',
            name: 'Voter ID Card',
            nameHindi: 'मतदाता पहचान पत्र',
            icon: '🗳️',
            category: 'cards',
            price: 0,
            processingTime: '30-45 days',
            description: 'Apply for voter ID card',
            popular: true,
            requiredDocs: ['Age Proof', 'Address Proof', 'Photo']
        },
        {
            id: 'labour-card',
            name: 'Labour Card',
            nameHindi: 'श्रमिक कार्ड',
            icon: '👷',
            category: 'cards',
            price: 50,
            processingTime: '10-15 days',
            description: 'Apply for labour card',
            popular: false,
            requiredDocs: ['Aadhar Card', 'Work Certificate', 'Photo']
        },
        {
            id: 'ration-card',
            name: 'Ration Card',
            nameHindi: 'राशन कार्ड',
            icon: '🌾',
            category: 'cards',
            price: 0,
            processingTime: '15-20 days',
            description: 'Apply for ration card',
            popular: false,
            requiredDocs: ['Aadhar Card', 'Address Proof', 'Income Certificate']
        },
        {
            id: 'death-certificate',
            name: 'Death Certificate',
            nameHindi: 'मृत्यु प्रमाण पत्र',
            icon: '⚰️',
            category: 'certificates',
            price: 30,
            processingTime: '3-5 days',
            description: 'Apply for death certificate',
            popular: false,
            requiredDocs: ['Hospital Certificate', 'Aadhar of Deceased', 'Applicant ID']
        }
    ];
}

// Render Services
function renderServices() {
    renderPopularServices();
    renderAllServices();
}

// Render Popular Services
function renderPopularServices() {
    const popularContainer = document.getElementById('popularServices');
    const popularServices = filteredServices.filter(s => s.popular);
    
    if (popularServices.length === 0) {
        popularContainer.innerHTML = '<p class="empty-state">No popular services found</p>';
        return;
    }
    
    popularContainer.innerHTML = popularServices.map(service => createServiceCard(service)).join('');
}

// Render All Services
function renderAllServices() {
    const allContainer = document.getElementById('allServices');
    
    if (filteredServices.length === 0) {
        allContainer.innerHTML = '<p class="empty-state">No services found</p>';
        return;
    }
    
    allContainer.innerHTML = filteredServices.map(service => createServiceCard(service)).join('');
}

// Create Service Card HTML
function createServiceCard(service) {
    return `
        <div class="service-card" onclick="openServiceForm('${service.id}')">
            <div class="service-icon">${service.icon}</div>
            <h3>${service.name}</h3>
            <p class="service-name-hindi">${service.nameHindi}</p>
            <p>${service.description}</p>
            <div class="service-meta">
                <span class="service-price">₹${service.price}</span>
                <span class="service-time">⏱️ ${service.processingTime}</span>
            </div>
            <button class="apply-btn">Apply Now</button>
        </div>
    `;
}

// Open Service Form
function openServiceForm(serviceId) {
    window.location.href = `janseva-form.html?service=${serviceId}`;
}

// Setup Event Listeners
function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('serviceSearch');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Category Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabButtons.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');
            // Filter services
            filterByCategory(btn.dataset.category);
        });
    });
    
    // FAQ Toggle
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
}

// Handle Search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    filteredServices = allServices.filter(service => 
        service.name.toLowerCase().includes(searchTerm) ||
        service.nameHindi.includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm)
    );
    
    renderServices();
}

// Filter by Category
function filterByCategory(category) {
    if (category === 'all') {
        filteredServices = allServices;
    } else {
        filteredServices = allServices.filter(s => s.category === category);
    }
    
    renderAllServices();
}

// Utility Functions
function formatPrice(price) {
    return price === 0 ? 'Free' : `₹${price}`;
}

function showNotification(message, type = 'success') {
    // Simple notification (can be enhanced)
    alert(message);
}
