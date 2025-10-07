// Jan Seva Form - Application Form Logic

const API_URL = 'http://localhost:3000/api';
let currentService = null;

// Initialize Form
document.addEventListener('DOMContentLoaded', () => {
    loadServiceDetails();
    setupFormHandlers();
});

// Load Service Details
async function loadServiceDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('service');
    
    if (!serviceId) {
        window.location.href = 'janseva.html';
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/janseva/services/${serviceId}`);
        const data = await response.json();
        
        if (data.success) {
            currentService = data.data;
        } else {
            // Fallback to local data
            currentService = getLocalServiceById(serviceId);
        }
    } catch (error) {
        console.log('Using local service data');
        currentService = getLocalServiceById(serviceId);
    }
    
    if (currentService) {
        renderServiceInfo();
        renderDocumentFields();
        updateServiceCharge();
    } else {
        alert('Service not found');
        window.location.href = 'janseva.html';
    }
}

// Get Local Service by ID
function getLocalServiceById(serviceId) {
    const services = {
        'caste-certificate': {
            id: 'caste-certificate',
            name: 'Caste Certificate',
            nameHindi: 'जाति प्रमाण पत्र',
            icon: '📜',
            category: 'certificates',
            price: 50,
            processingTime: '5-7 days',
            description: 'Apply for caste certificate online',
            requiredDocs: ['Aadhar Card', 'Address Proof', 'Previous Certificate (if any)']
        },
        'income-certificate': {
            id: 'income-certificate',
            name: 'Income Certificate',
            nameHindi: 'आय प्रमाण पत्र',
            icon: '💰',
            category: 'certificates',
            price: 50,
            processingTime: '5-7 days',
            description: 'Apply for income certificate',
            requiredDocs: ['Aadhar Card', 'Salary Slip', 'Bank Statement']
        },
        'birth-certificate': {
            id: 'birth-certificate',
            name: 'Birth Certificate',
            nameHindi: 'जन्म प्रमाण पत्र',
            icon: '👶',
            category: 'certificates',
            price: 30,
            processingTime: '3-5 days',
            description: 'Apply for birth certificate',
            requiredDocs: ['Hospital Certificate', 'Parents Aadhar', 'Address Proof']
        },
        'domicile-certificate': {
            id: 'domicile-certificate',
            name: 'Domicile Certificate',
            nameHindi: 'निवास प्रमाण पत्र',
            icon: '🏠',
            category: 'certificates',
            price: 50,
            processingTime: '7-10 days',
            description: 'Apply for domicile certificate',
            requiredDocs: ['Aadhar Card', 'Ration Card', 'Electricity Bill']
        },
        'pan-card': {
            id: 'pan-card',
            name: 'PAN Card',
            nameHindi: 'पैन कार्ड',
            icon: '💳',
            category: 'cards',
            price: 100,
            processingTime: '10-15 days',
            description: 'Apply for new PAN card',
            requiredDocs: ['Aadhar Card', 'Photo', 'Address Proof']
        }
    };
    
    return services[serviceId] || null;
}

// Render Service Info Sidebar
function renderServiceInfo() {
    const serviceInfoDiv = document.getElementById('serviceInfo');
    
    serviceInfoDiv.innerHTML = `
        <div class="service-info-icon">${currentService.icon}</div>
        <h2>${currentService.name}</h2>
        <p class="service-info-hindi">${currentService.nameHindi}</p>
        
        <div class="info-item">
            <span class="info-label">Service Charge</span>
            <span class="info-value">₹${currentService.price}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Processing Time</span>
            <span class="info-value">${currentService.processingTime}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Category</span>
            <span class="info-value">${currentService.category}</span>
        </div>
        
        <div class="required-docs">
            <h4>📎 Required Documents</h4>
            <ul>
                ${currentService.requiredDocs.map(doc => `<li>${doc}</li>`).join('')}
            </ul>
        </div>
    `;
}

// Render Document Upload Fields
function renderDocumentFields() {
    const documentFieldsDiv = document.getElementById('documentFields');
    
    const fields = currentService.requiredDocs.map((doc, index) => `
        <div class="file-upload-group">
            <label class="file-upload-label">${doc} <span class="required">*</span></label>
            <div class="file-upload-wrapper">
                <input type="file" 
                       id="doc${index}" 
                       name="document_${index}" 
                       accept=".pdf,.jpg,.jpeg,.png" 
                       required
                       onchange="handleFileSelect(this, ${index})">
                <div class="file-upload-icon">📎</div>
                <div class="file-upload-text">
                    <strong>Click to upload</strong> or drag and drop<br>
                    <span class="file-info">PDF, JPG, PNG (Max 2MB)</span>
                </div>
            </div>
            <div class="file-preview" id="preview${index}">
                <span class="file-name" id="fileName${index}"></span>
                <span class="file-remove" onclick="removeFile(${index})">✕</span>
            </div>
        </div>
    `).join('');
    
    documentFieldsDiv.innerHTML = fields;
}

// Update Service Charge
function updateServiceCharge() {
    const chargeElement = document.getElementById('serviceCharge');
    if (chargeElement) {
        chargeElement.textContent = currentService.price === 0 ? 'Free' : `₹${currentService.price}`;
    }
}

// Handle File Select
function handleFileSelect(input, index) {
    const file = input.files[0];
    
    if (file) {
        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('File size should not exceed 2MB');
            input.value = '';
            return;
        }
        
        // Validate file type
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            alert('Only PDF, JPG, and PNG files are allowed');
            input.value = '';
            return;
        }
        
        // Show preview
        const preview = document.getElementById(`preview${index}`);
        const fileName = document.getElementById(`fileName${index}`);
        
        fileName.textContent = file.name;
        preview.classList.add('active');
    }
}

// Remove File
function removeFile(index) {
    const input = document.getElementById(`doc${index}`);
    const preview = document.getElementById(`preview${index}`);
    
    input.value = '';
    preview.classList.remove('active');
}

// Setup Form Handlers
function setupFormHandlers() {
    const form = document.getElementById('janSevaForm');
    
    // Payment method toggle
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', handlePaymentMethodChange);
    });
    
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
}

// Handle Payment Method Change
function handlePaymentMethodChange(e) {
    const upiSection = document.getElementById('upiSection');
    const upiTransactionId = document.getElementById('upiTransactionId');
    
    if (e.target.value === 'upi') {
        upiSection.style.display = 'block';
        upiTransactionId.required = true;
    } else {
        upiSection.style.display = 'none';
        upiTransactionId.required = false;
    }
}

// Handle Form Submit
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    // Disable submit button
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';
    
    try {
        // Prepare form data
        const formData = new FormData(form);
        formData.append('serviceId', currentService.id);
        formData.append('serviceName', currentService.name);
        formData.append('serviceCharge', currentService.price);
        
        // Submit to backend
        const response = await fetch(`${API_URL}/janseva/applications`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccessModal(data.data.applicationNumber);
        } else {
            throw new Error(data.message || 'Submission failed');
        }
    } catch (error) {
        console.error('Submission error:', error);
        
        // Fallback: Generate local application number
        const appNumber = generateApplicationNumber();
        showSuccessModal(appNumber);
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

// Generate Application Number
function generateApplicationNumber() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 90000) + 10000;
    return `JSK-${year}-${random}`;
}

// Show Success Modal
function showSuccessModal(applicationNumber) {
    const modal = document.getElementById('successModal');
    const appNumberElement = document.getElementById('applicationNumber');
    
    appNumberElement.textContent = applicationNumber;
    modal.classList.add('active');
    
    // Store application number in localStorage
    localStorage.setItem('lastApplicationNumber', applicationNumber);
}

// Track Application
function trackApplication() {
    const appNumber = document.getElementById('applicationNumber').textContent;
    window.location.href = `janseva-track.html?app=${appNumber}`;
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('successModal');
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});
