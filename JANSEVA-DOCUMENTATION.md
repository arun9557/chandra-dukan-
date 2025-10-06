# 🏛️ Jan Seva Kendra - Complete Documentation
# जन सेवा केंद्र - संपूर्ण दस्तावेज़ीकरण

Complete guide for Jan Seva Kendra module - Government Citizen Services

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [File Structure](#file-structure)
4. [Setup & Installation](#setup--installation)
5. [User Guide](#user-guide)
6. [Admin Guide](#admin-guide)
7. [Developer Guide](#developer-guide)
8. [API Reference](#api-reference)
9. [Customization](#customization)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Jan Seva Kendra is a comprehensive government services module integrated into Chandra Dukan app. It allows citizens to apply for various government certificates, ID cards, and welfare schemes online.

### Key Features
- ✅ 12+ Government Services
- ✅ Online Application Forms
- ✅ Document Upload (PDF/JPG/PNG)
- ✅ UPI Payment Integration
- ✅ Application Tracking
- ✅ Admin Dashboard for Management
- ✅ Status Updates & Notifications
- ✅ Modern Blinkit-style UI

---

## 🌟 Features

### For Citizens
1. **Browse Services** - View all available government services
2. **Apply Online** - Fill forms and upload documents
3. **Make Payment** - Pay via UPI or Cash
4. **Track Application** - Monitor application status
5. **Download Certificate** - Get digital certificates

### For Admins
1. **Manage Applications** - View and process applications
2. **Update Status** - Change application status
3. **View Documents** - Access uploaded documents
4. **Generate Reports** - Analytics and statistics
5. **Add Services** - Add new government services

---

## 📁 File Structure

```
chandra-dukan/
├── frontend/
│   ├── janseva.html                    # Services listing page
│   ├── janseva-form.html               # Application form page
│   ├── janseva-style.css               # Main styles
│   ├── janseva-form-style.css          # Form styles
│   ├── janseva-app.js                  # Services page logic
│   ├── janseva-form.js                 # Form page logic
│   ├── components/
│   │   └── JanSevaService.js           # Utility functions
│   └── data/
│       └── janseva-services.json       # Services data (optional)
│
├── backend/
│   ├── routes/
│   │   └── janseva.js                  # API routes
│   └── uploads/
│       └── janseva/                    # Uploaded documents
│
├── admin/
│   ├── views/
│   │   └── janseva.js                  # Admin panel logic
│   └── index.html                      # Admin dashboard (updated)
│
└── JANSEVA-DOCUMENTATION.md            # This file
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+
- Backend server running
- MongoDB (optional, uses in-memory storage by default)

### Installation Steps

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Server already includes Jan Seva routes
   npm start
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   # No additional setup needed
   python3 -m http.server 8000
   ```

3. **Access Jan Seva**
   - Homepage: http://localhost:8000
   - Jan Seva Section: Click on "Jan Seva Kendra" banner
   - Direct Link: http://localhost:8000/janseva.html
   - Admin Panel: http://localhost:8000/admin/ → Jan Seva Kendra

---

## 👥 User Guide

### How to Apply for a Service

#### Step 1: Browse Services
1. Open homepage: http://localhost:8000
2. Click on "Jan Seva Kendra" banner
3. Browse available services
4. Use search or filter by category

#### Step 2: Select Service
1. Click on desired service card
2. Review service details:
   - Service charge
   - Processing time
   - Required documents
3. Click "Apply Now"

#### Step 3: Fill Application Form
1. **Personal Details**
   - Full Name
   - Father's Name
   - Mother's Name (optional)
   - Date of Birth
   - Gender

2. **Contact Details**
   - Mobile Number (10 digits)
   - Email (optional)
   - Full Address
   - District
   - PIN Code

3. **Upload Documents**
   - Upload required documents
   - Supported formats: PDF, JPG, PNG
   - Max size: 2MB per file

4. **Additional Information**
   - Add any remarks or special requests

5. **Payment**
   - Select payment method (UPI/Cash)
   - If UPI: Scan QR code and enter transaction ID
   - If Cash: Pay at center

6. **Submit**
   - Accept terms and conditions
   - Click "Submit Application"
   - Note down application number

#### Step 4: Track Application
1. Save your application number
2. Use tracking page (coming soon)
3. Or contact helpline: 1800-XXX-XXXX

---

## 👨‍💼 Admin Guide

### Accessing Admin Panel

1. Open: http://localhost:8000/admin/
2. Click on "Jan Seva Kendra" card
3. View dashboard with statistics

### Managing Applications

#### View Applications
- See all applications in table format
- Filter by status (Pending, Under Review, Approved, etc.)
- Search by application number, name, or mobile

#### View Application Details
1. Click 👁️ (eye icon) on any application
2. View complete details:
   - Applicant information
   - Uploaded documents
   - Payment details
   - Current status

#### Update Application Status
1. Click ✏️ (edit icon) on application
2. Select new status:
   - **Pending** - Just submitted
   - **Under Review** - Being processed
   - **Approved** - Approved by authority
   - **Rejected** - Rejected (with reason)
   - **Completed** - Certificate issued
3. Add remarks (optional)
4. Click "Update Status"

#### Download Documents
1. Click 📥 (download icon)
2. Downloads all uploaded documents
3. Review documents for verification

### Statistics Dashboard
- **Total Applications** - All time count
- **Pending** - Awaiting processing
- **Under Review** - Currently being reviewed
- **Approved** - Approved applications
- **Completed** - Certificates issued
- **Total Revenue** - Revenue from service charges

---

## 💻 Developer Guide

### Adding New Service

#### Method 1: Via API
```javascript
const newService = {
    id: 'driving-license',
    name: 'Driving License',
    nameHindi: 'ड्राइविंग लाइसेंस',
    icon: '🚗',
    category: 'cards',
    price: 200,
    processingTime: '15-20 days',
    description: 'Apply for driving license',
    popular: false,
    requiredDocs: ['Aadhar Card', 'Photo', 'Medical Certificate'],
    active: true
};

fetch('http://localhost:3000/api/janseva/services', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newService)
});
```

#### Method 2: Update Backend Code
Edit `backend/routes/janseva.js` and add to `services` array:

```javascript
{
    id: 'driving-license',
    name: 'Driving License',
    nameHindi: 'ड्राइविंग लाइसेंस',
    icon: '🚗',
    category: 'cards',
    price: 200,
    processingTime: '15-20 days',
    description: 'Apply for driving license',
    popular: false,
    requiredDocs: ['Aadhar Card', 'Photo', 'Medical Certificate'],
    active: true
}
```

### Customizing Form Fields

Edit `frontend/janseva-form.html` to add/modify form fields:

```html
<div class="form-group">
    <label for="customField">Custom Field <span class="required">*</span></label>
    <input type="text" id="customField" name="customField" required>
</div>
```

### Customizing Styles

Edit `frontend/janseva-style.css`:

```css
:root {
    --primary-green: #16a34a;  /* Change primary color */
    --secondary-blue: #2563eb; /* Change secondary color */
}
```

---

## 📡 API Reference

### Base URL
```
http://localhost:3000/api/janseva
```

### Endpoints

#### 1. Get All Services
```http
GET /api/janseva/services
```

**Response:**
```json
{
    "success": true,
    "data": [...],
    "count": 12
}
```

#### 2. Get Service by ID
```http
GET /api/janseva/services/:id
```

**Response:**
```json
{
    "success": true,
    "data": {
        "id": "caste-certificate",
        "name": "Caste Certificate",
        ...
    }
}
```

#### 3. Submit Application
```http
POST /api/janseva/applications
Content-Type: multipart/form-data
```

**Body:**
- Form fields (fullName, mobile, etc.)
- Files (documents)

**Response:**
```json
{
    "success": true,
    "message": "Application submitted successfully",
    "data": {
        "applicationNumber": "JSK-2024-12345",
        "status": "pending"
    }
}
```

#### 4. Get All Applications (Admin)
```http
GET /api/janseva/applications?status=pending
```

**Query Parameters:**
- `status` - Filter by status
- `serviceId` - Filter by service
- `mobile` - Filter by mobile number
- `startDate` - Start date
- `endDate` - End date

#### 5. Get Application by Number
```http
GET /api/janseva/applications/:appNumber
```

#### 6. Update Application Status
```http
PATCH /api/janseva/applications/:appNumber/status
Content-Type: application/json

{
    "status": "approved",
    "remarks": "Approved by authority"
}
```

#### 7. Get Statistics
```http
GET /api/janseva/stats
```

**Response:**
```json
{
    "success": true,
    "data": {
        "totalApplications": 150,
        "pending": 25,
        "underReview": 30,
        "approved": 50,
        "completed": 40,
        "totalRevenue": 7500
    }
}
```

---

## 🎨 Customization

### Change Colors
Edit `frontend/janseva-style.css`:

```css
:root {
    --primary-green: #your-color;
    --primary-green-dark: #your-dark-color;
}
```

### Add New Category
Edit `frontend/janseva.html` and add tab button:

```html
<button class="tab-btn" data-category="new-category">New Category</button>
```

### Modify Payment Options
Edit `frontend/janseva-form.html`:

```html
<label class="payment-option">
    <input type="radio" name="paymentMethod" value="card">
    <span class="payment-label">
        <span class="payment-icon">💳</span>
        Credit/Debit Card
    </span>
</label>
```

### Add Email Notifications
In `backend/routes/janseva.js`, add after application submission:

```javascript
// Send email notification
const nodemailer = require('nodemailer');
// Configure and send email
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Services Not Loading
**Problem:** Services page shows empty or loading forever

**Solution:**
- Check backend is running: `http://localhost:3000/api/health`
- Check API URL in `janseva-app.js`
- Check browser console for errors

#### 2. File Upload Fails
**Problem:** Document upload shows error

**Solution:**
- Check file size (max 2MB)
- Check file format (PDF, JPG, PNG only)
- Check uploads directory exists: `backend/uploads/janseva/`
- Check file permissions

#### 3. Form Submission Fails
**Problem:** Form shows error on submit

**Solution:**
- Check all required fields are filled
- Check mobile number is 10 digits
- Check PIN code is 6 digits
- Check backend API is accessible

#### 4. Admin Panel Not Showing Applications
**Problem:** Admin panel shows no applications

**Solution:**
- Submit a test application first
- Check API endpoint: `http://localhost:3000/api/janseva/applications`
- Check browser console for errors

#### 5. Payment Section Not Working
**Problem:** UPI section not showing/hiding

**Solution:**
- Check JavaScript is loaded
- Check `janseva-form.js` is included
- Check browser console for errors

---

## 📞 Support

### Getting Help

**Documentation:**
- This file (JANSEVA-DOCUMENTATION.md)
- Main README.md
- API-DOCUMENTATION.md

**Contact:**
- Email: support@chandradukan.com
- Phone: +91 98765 43210
- Helpline: 1800-XXX-XXXX

---

## 🔄 Updates & Maintenance

### Regular Maintenance Tasks

1. **Backup Applications**
   - Export applications data regularly
   - Store uploaded documents safely

2. **Monitor Storage**
   - Check uploads folder size
   - Clean old documents if needed

3. **Update Services**
   - Add new services as needed
   - Update prices and processing times

4. **Review Applications**
   - Process pending applications daily
   - Update statuses promptly

---

## 🎉 Success!

Your Jan Seva Kendra module is now fully functional!

### What You Can Do Now:

✅ Citizens can apply for government services online  
✅ Documents can be uploaded securely  
✅ Payments can be made via UPI  
✅ Applications can be tracked  
✅ Admins can manage all applications  
✅ Statistics and reports available  

---

**Made with ❤️ for Digital India**

*डिजिटल इंडिया के लिए बनाया गया - Made for Digital India*
