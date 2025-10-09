// JanSeva Model - जनसेवा मॉडल
// MongoDB schema for JanSeva (government services) applications

const mongoose = require('mongoose');

const janSevaSchema = new mongoose.Schema({
  applicationNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    enum: [
      'aadhaar_card',
      'pan_card',
      'voter_id',
      'ration_card',
      'driving_license',
      'passport',
      'birth_certificate',
      'death_certificate',
      'income_certificate',
      'caste_certificate',
      'domicile_certificate',
      'electricity_bill',
      'water_bill',
      'gas_connection',
      'bank_account',
      'other'
    ]
  },
  serviceDetails: {
    type: String,
    required: true,
    trim: true
  },
  applicantDetails: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    fatherName: {
      type: String,
      trim: true,
      default: ''
    },
    motherName: {
      type: String,
      trim: true,
      default: ''
    },
    dob: {
      type: Date,
      default: null
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'male'
    },
    phone: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid phone number']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: '' },
      pincode: { type: String, required: true },
      landmark: { type: String, default: '' }
    }
  },
  documents: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'in_review', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
    updatedBy: String
  }],
  fees: {
    amount: {
      type: Number,
      default: 0,
      min: 0
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      default: ''
    },
    transactionId: {
      type: String,
      default: ''
    }
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  completionDate: {
    type: Date,
    default: null
  },
  estimatedCompletionDate: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  adminNotes: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  trackingUpdates: [{
    message: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Indexes
janSevaSchema.index({ applicationNumber: 1 });
janSevaSchema.index({ user: 1 });
janSevaSchema.index({ serviceType: 1 });
janSevaSchema.index({ status: 1 });
janSevaSchema.index({ applicationDate: -1 });
janSevaSchema.index({ 'applicantDetails.phone': 1 });

// Generate application number before saving
janSevaSchema.pre('save', async function(next) {
  if (!this.applicationNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Find the last application of the day
    const lastApp = await this.constructor.findOne({
      applicationNumber: new RegExp(`^JS${year}${month}${day}`)
    }).sort({ applicationNumber: -1 });
    
    let sequence = 1;
    if (lastApp) {
      const lastSequence = parseInt(lastApp.applicationNumber.slice(-4));
      sequence = lastSequence + 1;
    }
    
    this.applicationNumber = `JS${year}${month}${day}${sequence.toString().padStart(4, '0')}`;
  }
  next();
});

// Add status to history before saving
janSevaSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: ''
    });
  }
  next();
});

// Method to update status
janSevaSchema.methods.updateStatus = async function(newStatus, note = '', updatedBy = 'system') {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note,
    updatedBy
  });
  
  if (newStatus === 'completed') {
    this.completionDate = new Date();
  }
  
  return await this.save();
};

// Method to add tracking update
janSevaSchema.methods.addTrackingUpdate = async function(message) {
  this.trackingUpdates.push({
    message,
    timestamp: new Date()
  });
  return await this.save();
};

// Method to add document
janSevaSchema.methods.addDocument = async function(name, type, url) {
  this.documents.push({
    name,
    type,
    url,
    uploadedAt: new Date()
  });
  return await this.save();
};

// Static method to find by application number
janSevaSchema.statics.findByApplicationNumber = function(applicationNumber) {
  return this.findOne({ applicationNumber }).populate('user');
};

// Static method to find user applications
janSevaSchema.statics.findUserApplications = function(userId, limit = 10) {
  return this.find({ user: userId })
    .sort({ applicationDate: -1 })
    .limit(limit);
};

// Static method to get pending applications
janSevaSchema.statics.getPendingApplications = function() {
  return this.find({ status: 'pending' })
    .sort({ applicationDate: 1 })
    .populate('user');
};

// Static method to get statistics
janSevaSchema.statics.getStats = async function(startDate, endDate) {
  const stats = await this.aggregate([
    {
      $match: {
        applicationDate: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  return stats;
};

const JanSeva = mongoose.model('JanSeva', janSevaSchema);

module.exports = JanSeva;
