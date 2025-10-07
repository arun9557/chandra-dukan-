// Jan Seva Kendra - Backend API Routes

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './uploads/janseva';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'doc-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|jpg|jpeg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF, JPG, and PNG files are allowed'));
        }
    }
});

// In-memory storage (replace with database in production)
let services = [
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
        requiredDocs: ['Aadhar Card', 'Address Proof', 'Previous Certificate (if any)'],
        active: true
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
        requiredDocs: ['Aadhar Card', 'Salary Slip', 'Bank Statement'],
        active: true
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
        requiredDocs: ['Hospital Certificate', 'Parents Aadhar', 'Address Proof'],
        active: true
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
        requiredDocs: ['Aadhar Card', 'Ration Card', 'Electricity Bill'],
        active: true
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
        requiredDocs: ['Aadhar Card', 'Photo', 'Address Proof'],
        active: true
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
        requiredDocs: ['Existing Aadhar', 'Updated Documents'],
        active: true
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
        requiredDocs: ['Age Proof', 'Income Certificate', 'Bank Details'],
        active: true
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
        requiredDocs: ['Marksheet', 'Income Certificate', 'Bank Details'],
        active: true
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
        requiredDocs: ['Age Proof', 'Address Proof', 'Photo'],
        active: true
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
        requiredDocs: ['Aadhar Card', 'Work Certificate', 'Photo'],
        active: true
    }
];

let applications = [];

// GET /api/janseva/services - Get all services
router.get('/services', (req, res) => {
    try {
        const activeServices = services.filter(s => s.active);
        res.json({
            success: true,
            data: activeServices,
            count: activeServices.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching services',
            error: error.message
        });
    }
});

// GET /api/janseva/services/:id - Get service by ID
router.get('/services/:id', (req, res) => {
    try {
        const service = services.find(s => s.id === req.params.id);
        
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }
        
        res.json({
            success: true,
            data: service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching service',
            error: error.message
        });
    }
});

// POST /api/janseva/services - Add new service (Admin only)
router.post('/services', (req, res) => {
    try {
        const newService = {
            id: req.body.id || req.body.name.toLowerCase().replace(/\s+/g, '-'),
            ...req.body,
            active: true
        };
        
        services.push(newService);
        
        res.status(201).json({
            success: true,
            message: 'Service added successfully',
            data: newService
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding service',
            error: error.message
        });
    }
});

// POST /api/janseva/applications - Submit application
router.post('/applications', upload.array('documents', 10), async (req, res) => {
    try {
        const {
            serviceId,
            serviceName,
            serviceCharge,
            fullName,
            fatherName,
            motherName,
            dob,
            gender,
            mobile,
            email,
            address,
            district,
            pincode,
            remarks,
            paymentMethod,
            upiTransactionId
        } = req.body;
        
        // Generate application number
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 90000) + 10000;
        const applicationNumber = `JSK-${year}-${random}`;
        
        // Process uploaded files
        const documents = req.files ? req.files.map(file => ({
            originalName: file.originalname,
            filename: file.filename,
            path: file.path,
            size: file.size,
            uploadedAt: new Date()
        })) : [];
        
        // Create application object
        const application = {
            applicationNumber,
            serviceId,
            serviceName,
            serviceCharge: parseFloat(serviceCharge) || 0,
            applicant: {
                fullName,
                fatherName,
                motherName,
                dob,
                gender,
                mobile,
                email,
                address,
                district,
                pincode
            },
            documents,
            payment: {
                method: paymentMethod,
                amount: parseFloat(serviceCharge) || 0,
                transactionId: upiTransactionId || null,
                status: paymentMethod === 'cash' ? 'pending' : 'completed'
            },
            remarks,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        // Save application
        applications.push(application);
        
        // In production, save to database
        // await Application.create(application);
        
        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: {
                applicationNumber,
                status: 'pending',
                estimatedProcessingTime: services.find(s => s.id === serviceId)?.processingTime || '5-7 days'
            }
        });
    } catch (error) {
        console.error('Application submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting application',
            error: error.message
        });
    }
});

// GET /api/janseva/applications - Get all applications (Admin)
router.get('/applications', (req, res) => {
    try {
        const { status, serviceId, mobile, startDate, endDate } = req.query;
        
        let filteredApplications = [...applications];
        
        // Filter by status
        if (status) {
            filteredApplications = filteredApplications.filter(app => app.status === status);
        }
        
        // Filter by service
        if (serviceId) {
            filteredApplications = filteredApplications.filter(app => app.serviceId === serviceId);
        }
        
        // Filter by mobile
        if (mobile) {
            filteredApplications = filteredApplications.filter(app => app.applicant.mobile === mobile);
        }
        
        // Filter by date range
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            filteredApplications = filteredApplications.filter(app => {
                const appDate = new Date(app.createdAt);
                return appDate >= start && appDate <= end;
            });
        }
        
        // Sort by creation date (newest first)
        filteredApplications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        res.json({
            success: true,
            data: filteredApplications,
            count: filteredApplications.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
});

// GET /api/janseva/applications/:appNumber - Get application by number
router.get('/applications/:appNumber', (req, res) => {
    try {
        const application = applications.find(app => app.applicationNumber === req.params.appNumber);
        
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }
        
        res.json({
            success: true,
            data: application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching application',
            error: error.message
        });
    }
});

// PATCH /api/janseva/applications/:appNumber/status - Update application status
router.patch('/applications/:appNumber/status', (req, res) => {
    try {
        const { status, remarks } = req.body;
        const application = applications.find(app => app.applicationNumber === req.params.appNumber);
        
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }
        
        // Valid statuses
        const validStatuses = ['pending', 'under_review', 'approved', 'rejected', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }
        
        application.status = status;
        application.updatedAt = new Date();
        
        if (remarks) {
            application.adminRemarks = remarks;
        }
        
        res.json({
            success: true,
            message: 'Application status updated',
            data: application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating application status',
            error: error.message
        });
    }
});

// GET /api/janseva/stats - Get statistics (Admin)
router.get('/stats', (req, res) => {
    try {
        const stats = {
            totalApplications: applications.length,
            pending: applications.filter(app => app.status === 'pending').length,
            underReview: applications.filter(app => app.status === 'under_review').length,
            approved: applications.filter(app => app.status === 'approved').length,
            rejected: applications.filter(app => app.status === 'rejected').length,
            completed: applications.filter(app => app.status === 'completed').length,
            totalRevenue: applications.reduce((sum, app) => sum + app.serviceCharge, 0),
            popularServices: services
                .filter(s => s.popular)
                .map(s => ({
                    id: s.id,
                    name: s.name,
                    applications: applications.filter(app => app.serviceId === s.id).length
                }))
                .sort((a, b) => b.applications - a.applications)
                .slice(0, 5)
        };
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
});

module.exports = router;
