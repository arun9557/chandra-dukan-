// Check User Script - Database me user check karna
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function checkUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const user = await User.findOne({ email: 'chandra@chandradukan.com' }).select('+password');
    
    if (user) {
      console.log('\n📊 User Found:');
      console.log('Name:', user.name);
      console.log('Email:', user.email);
      console.log('Phone:', user.phone);
      console.log('Role:', user.role);
      console.log('Password Hash:', user.password.substring(0, 30) + '...');
      
      // Test password comparison
      const testPassword = 'admin123';
      const isValid = await user.comparePassword(testPassword);
      console.log(`\n🔐 Password test for "${testPassword}":`, isValid ? '✅ VALID' : '❌ INVALID');
      
    } else {
      console.log('❌ User not found');
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkUser();
