// Test MongoDB Connection - MongoDB connection test करना
// Run: node scripts/test-db.js

require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chandra-dukan';
    
    console.log('🔄 Testing MongoDB connection...');
    console.log(`📍 URI: ${mongoURI.replace(/\/\/.*@/, '//***:***@')}\n`); // Hide credentials
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('✅ MongoDB Connection Successful!');
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`🔌 Port: ${conn.connection.port}`);
    console.log(`📝 Ready State: ${conn.connection.readyState === 1 ? 'Connected' : 'Not Connected'}\n`);
    
    // List collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`📂 Collections (${collections.length}):`);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    // Get collection stats
    if (collections.length > 0) {
      console.log('\n📊 Collection Stats:');
      for (const col of collections) {
        const count = await conn.connection.db.collection(col.name).countDocuments();
        console.log(`   ${col.name}: ${count} documents`);
      }
    }
    
    console.log('\n✨ Connection test completed successfully!');
    
    await mongoose.connection.close();
    console.log('🔌 Connection closed\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ MongoDB Connection Failed!');
    console.error(`Error: ${error.message}\n`);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 Troubleshooting:');
      console.log('   1. Make sure MongoDB is installed and running');
      console.log('   2. Start MongoDB: sudo systemctl start mongod');
      console.log('   3. Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas');
      console.log('   4. Update MONGODB_URI in .env file\n');
    }
    
    process.exit(1);
  }
};

testConnection();
