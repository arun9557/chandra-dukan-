// Jan Seva Admin Panel - Manage Applications

const API_URL = 'http://localhost:3000/api';

let allApplications = [];
let filteredApplications = [];
let currentFilter = 'all';

// Initialize
async function initJanSeva() {
    await loadApplications();
    await loadStats();
    setupEventListeners();
}

// Load Applications
async function loadApplications() {
    try {
        const response = await fetch(`${API_URL}/janseva/applications`);
        const data = await response.json();
        
        if (data.success) {
            allApplications = data.data;
            filteredApplications = allApplications;
            renderApplications();
        }
    } catch (error) {
        console.error('Error loading applications:', error);
        showNotification('Error loading applications', 'error');
    }
}

// Load Statistics
async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/janseva/stats`);
        const data = await response.json();
        
        if (data.success) {
            renderStats(data.data);
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Render Statistics
function renderStats(stats) {
    const statsHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">📊</div>
                <div class="stat-info">
                    <h3>${stats.totalApplications}</h3>
                    <p>Total Applications</p>
                </div>
            </div>
            <div class="stat-card pending">
                <div class="stat-icon">⏳</div>
                <div class="stat-info">
                    <h3>${stats.pending}</h3>
                    <p>Pending</p>
                </div>
            </div>
            <div class="stat-card review">
                <div class="stat-icon">🔍</div>
                <div class="stat-info">
                    <h3>${stats.underReview}</h3>
                    <p>Under Review</p>
                </div>
            </div>
            <div class="stat-card approved">
                <div class="stat-icon">✅</div>
                <div class="stat-info">
                    <h3>${stats.approved}</h3>
                    <p>Approved</p>
                </div>
            </div>
            <div class="stat-card completed">
                <div class="stat-icon">🎉</div>
                <div class="stat-info">
                    <h3>${stats.completed}</h3>
                    <p>Completed</p>
                </div>
            </div>
            <div class="stat-card revenue">
                <div class="stat-icon">💰</div>
                <div class="stat-info">
                    <h3>₹${stats.totalRevenue}</h3>
                    <p>Total Revenue</p>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('janSevaStats').innerHTML = statsHTML;
}

// Render Applications
function renderApplications() {
    const container = document.getElementById('applicationsTable');
    
    if (filteredApplications.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No applications found</p>
            </div>
        `;
        return;
    }
    
    const tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>App Number</th>
                    <th>Service</th>
                    <th>Applicant</th>
                    <th>Mobile</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${filteredApplications.map(app => createApplicationRow(app)).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = tableHTML;
}

// Create Application Row
function createApplicationRow(app) {
    const statusClass = getStatusClass(app.status);
    const paymentClass = app.payment.status === 'completed' ? 'success' : 'warning';
    
    return `
        <tr>
            <td><strong>${app.applicationNumber}</strong></td>
            <td>${app.serviceName}</td>
            <td>${app.applicant.fullName}</td>
            <td>${app.applicant.mobile}</td>
            <td>${formatDate(app.createdAt)}</td>
            <td>₹${app.serviceCharge}</td>
            <td><span class="badge ${paymentClass}">${app.payment.status}</span></td>
            <td><span class="badge ${statusClass}">${app.status}</span></td>
            <td>
                <button class="btn-icon" onclick="viewApplication('${app.applicationNumber}')" title="View Details">
                    👁️
                </button>
                <button class="btn-icon" onclick="updateStatus('${app.applicationNumber}')" title="Update Status">
                    ✏️
                </button>
                <button class="btn-icon" onclick="downloadDocuments('${app.applicationNumber}')" title="Download Documents">
                    📥
                </button>
            </td>
        </tr>
    `;
}

// View Application Details
async function viewApplication(appNumber) {
    try {
        const response = await fetch(`${API_URL}/janseva/applications/${appNumber}`);
        const data = await response.json();
        
        if (data.success) {
            showApplicationModal(data.data);
        }
    } catch (error) {
        console.error('Error loading application:', error);
        showNotification('Error loading application details', 'error');
    }
}

// Show Application Modal
function showApplicationModal(app) {
    const modalHTML = `
        <div class="modal active" id="appModal">
            <div class="modal-content large">
                <div class="modal-header">
                    <h2>Application Details</h2>
                    <button class="close-btn" onclick="closeModal('appModal')">✕</button>
                </div>
                <div class="modal-body">
                    <div class="app-details-grid">
                        <div class="detail-section">
                            <h3>📋 Application Info</h3>
                            <div class="detail-item">
                                <span class="label">Application Number:</span>
                                <span class="value"><strong>${app.applicationNumber}</strong></span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Service:</span>
                                <span class="value">${app.serviceName}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Service Charge:</span>
                                <span class="value">₹${app.serviceCharge}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Status:</span>
                                <span class="value"><span class="badge ${getStatusClass(app.status)}">${app.status}</span></span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Applied On:</span>
                                <span class="value">${formatDateTime(app.createdAt)}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>👤 Applicant Details</h3>
                            <div class="detail-item">
                                <span class="label">Name:</span>
                                <span class="value">${app.applicant.fullName}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Father's Name:</span>
                                <span class="value">${app.applicant.fatherName}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Date of Birth:</span>
                                <span class="value">${app.applicant.dob}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Gender:</span>
                                <span class="value">${app.applicant.gender}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Mobile:</span>
                                <span class="value">${app.applicant.mobile}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Email:</span>
                                <span class="value">${app.applicant.email || 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Address:</span>
                                <span class="value">${app.applicant.address}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">District:</span>
                                <span class="value">${app.applicant.district}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">PIN Code:</span>
                                <span class="value">${app.applicant.pincode}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>💳 Payment Details</h3>
                            <div class="detail-item">
                                <span class="label">Method:</span>
                                <span class="value">${app.payment.method.toUpperCase()}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Amount:</span>
                                <span class="value">₹${app.payment.amount}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Status:</span>
                                <span class="value"><span class="badge ${app.payment.status === 'completed' ? 'success' : 'warning'}">${app.payment.status}</span></span>
                            </div>
                            ${app.payment.transactionId ? `
                            <div class="detail-item">
                                <span class="label">Transaction ID:</span>
                                <span class="value">${app.payment.transactionId}</span>
                            </div>
                            ` : ''}
                        </div>
                        
                        <div class="detail-section full-width">
                            <h3>📎 Documents</h3>
                            <div class="documents-list">
                                ${app.documents.map((doc, index) => `
                                    <div class="document-item">
                                        <span class="doc-icon">📄</span>
                                        <span class="doc-name">${doc.originalName}</span>
                                        <span class="doc-size">${formatFileSize(doc.size)}</span>
                                        <button class="btn-small" onclick="downloadDocument('${doc.filename}')">Download</button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        ${app.remarks ? `
                        <div class="detail-section full-width">
                            <h3>📝 Remarks</h3>
                            <p>${app.remarks}</p>
                        </div>
                        ` : ''}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="closeModal('appModal')">Close</button>
                    <button class="btn-primary" onclick="updateStatus('${app.applicationNumber}')">Update Status</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Update Application Status
function updateStatus(appNumber) {
    const statusHTML = `
        <div class="modal active" id="statusModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Update Application Status</h2>
                    <button class="close-btn" onclick="closeModal('statusModal')">✕</button>
                </div>
                <div class="modal-body">
                    <form id="statusForm">
                        <div class="form-group">
                            <label>Application Number</label>
                            <input type="text" value="${appNumber}" readonly>
                        </div>
                        <div class="form-group">
                            <label>New Status</label>
                            <select id="newStatus" required>
                                <option value="">Select Status</option>
                                <option value="pending">Pending</option>
                                <option value="under_review">Under Review</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Remarks (Optional)</label>
                            <textarea id="statusRemarks" rows="3" placeholder="Add any remarks..."></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="closeModal('statusModal')">Cancel</button>
                    <button class="btn-primary" onclick="submitStatusUpdate('${appNumber}')">Update Status</button>
                </div>
            </div>
        </div>
    `;
    
    // Close previous modal if exists
    closeModal('appModal');
    
    document.body.insertAdjacentHTML('beforeend', statusHTML);
}

// Submit Status Update
async function submitStatusUpdate(appNumber) {
    const newStatus = document.getElementById('newStatus').value;
    const remarks = document.getElementById('statusRemarks').value;
    
    if (!newStatus) {
        showNotification('Please select a status', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/janseva/applications/${appNumber}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus, remarks })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Status updated successfully', 'success');
            closeModal('statusModal');
            await loadApplications();
            await loadStats();
        } else {
            showNotification(data.message || 'Error updating status', 'error');
        }
    } catch (error) {
        console.error('Error updating status:', error);
        showNotification('Error updating status', 'error');
    }
}

// Filter Applications
function filterApplications(status) {
    currentFilter = status;
    
    if (status === 'all') {
        filteredApplications = allApplications;
    } else {
        filteredApplications = allApplications.filter(app => app.status === status);
    }
    
    renderApplications();
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Search Applications
function searchApplications(query) {
    const searchTerm = query.toLowerCase();
    
    filteredApplications = allApplications.filter(app => 
        app.applicationNumber.toLowerCase().includes(searchTerm) ||
        app.applicant.fullName.toLowerCase().includes(searchTerm) ||
        app.applicant.mobile.includes(searchTerm) ||
        app.serviceName.toLowerCase().includes(searchTerm)
    );
    
    renderApplications();
}

// Setup Event Listeners
function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('appSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => searchApplications(e.target.value));
    }
}

// Utility Functions
function getStatusClass(status) {
    const classes = {
        'pending': 'warning',
        'under_review': 'info',
        'approved': 'success',
        'rejected': 'danger',
        'completed': 'success'
    };
    return classes[status] || 'default';
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-IN');
}

function formatDateTime(date) {
    return new Date(date).toLocaleString('en-IN');
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}

function showNotification(message, type = 'info') {
    // Simple notification (can be enhanced)
    alert(message);
}

function downloadDocument(filename) {
    window.open(`${API_URL.replace('/api', '')}/uploads/janseva/${filename}`, '_blank');
}

function downloadDocuments(appNumber) {
    // In production, create a ZIP of all documents
    alert('Downloading all documents for ' + appNumber);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initJanSeva);
} else {
    initJanSeva();
}
