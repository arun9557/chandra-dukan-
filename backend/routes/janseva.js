// Jan Seva Kendra - Backend API Routes

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');

// Security middleware
router.use(helmet());

// CORS configuration
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
router.use(cors(corsOptions));

// Rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes'
    }
});
router.use(apiLimiter);

// Request logging
router.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

// Validate request content type
router.use((req, res, next) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && 
        !req.is('application/json') && 
        req.get('content-type') !== 'multipart/form-data') {
        return res.status(415).json({
            success: false,
            message: 'Content-Type must be application/json or multipart/form-data'
        });
    }
    next();
});

// Configure multer for memory storage (for serverless compatibility)
const storage = multer.memoryStorage();

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

// Configure Cloudinary
const cloudinary = require('cloudinary').v2;
if (process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Helper function to upload files to Cloudinary
const uploadToCloudinary = (buffer, folder = 'janseva') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder: folder,
        resource_type: 'auto',
        transformation: [
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          bytes: result.bytes
        });
      }
    );
    uploadStream.end(buffer);
  });
};

// Check required environment variables
const requiredEnvVars = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars.join(', '));
    process.exit(1);
}

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

// POST /api/janseva/applications - Create new application with validation
router.post('/applications', 
    upload.array('documents', 5),
    [
        body('serviceId').notEmpty().withMessage('Service ID is required'),
        body('fullName').trim().notEmpty().withMessage('Full name is required'),
        body('mobile')
            .trim()
            .isMobilePhone('any', { strictMode: false })
            .withMessage('Please provide a valid mobile number'),
        body('aadhaarNumber')
            .trim()
            .matches(/^\d{12}$/)
            .withMessage('Aadhaar number must be 12 digits')
    ],
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array().map(err => ({
                    field: err.param,
                    message: err.msg
                }))
            });
        }
        
        try {
            const { serviceId, fullName, mobile, aadhaarNumber } = req.body;

            // Validate required fields
            if (!serviceId || !fullName || !mobile || !aadhaarNumber) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields: serviceId, fullName, mobile, and aadhaarNumber are required'
                });
            }

            // Process file uploads if any
            let documents = [];
            if (req.files && req.files.length > 0) {
                // Upload files to Cloudinary
                const uploadPromises = req.files.map(file => 
                    uploadToCloudinary(file.buffer, 'janseva/documents')
                );
                documents = await Promise.all(uploadPromises);
            }

            // Create new application with UUID
            const newApplication = {
                id: `APP-${uuidv4()}`,
                applicationNumber: `APP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
                serviceId,
                fullName,
                mobile,
                aadhaarNumber,
                documents,
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            applications.push(newApplication);

            res.status(201).json({
                success: true,
                message: 'Application submitted successfully',
                data: newApplication
            });
        } catch (error) {
            console.error('Error creating application:', error);
            
            // Handle file upload errors
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({
                    success: false,
                    message: 'File size too large. Maximum size is 2MB'
                });
            }

            // Handle file type errors
            if (error.message === 'Only PDF, JPG, and PNG files are allowed') {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            // Default error handler
            res.status(500).json({
                success: false,
                message: 'Failed to create application',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
);

// PATCH /api/janseva/applications/:appNumber/status - Update application status
router.patch('/applications/:appNumber/status', (req, res) => {
    try {
        const { status, remarks } = req.body;
        const application = applications.find(app => app.id === req.params.appNumber);
        
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

// Error handling middleware (should be the last middleware)
router.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Application:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique application ID
 *         applicationNumber:
 *           type: string
 *           description: Human-readable application number
 *         serviceId:
 *           type: string
 *           description: ID of the service
 *         fullName:
 *           type: string
 *           description: Full name of the applicant
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           default: pending
 */

module.exports = router;
