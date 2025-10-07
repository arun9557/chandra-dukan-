// Database Seeding Script - Database में initial data डालना
// Run: node scripts/seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chandra-dukan';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Sample Categories
const categories = [
  {
    name: 'Cold Drinks & Beverages',
    hindiName: 'Cold Drink aur Juice',
    icon: '🥤',
    description: 'Refreshing cold drinks, juices, and beverages',
    displayOrder: 1,
    isActive: true
  },
  {
    name: 'Namkeen & Snacks',
    hindiName: 'Namkeen aur Biscuit',
    icon: '🍪',
    description: 'Chips, namkeen, biscuits and snacks',
    displayOrder: 2,
    isActive: true
  },
  {
    name: 'Daily Essentials',
    hindiName: 'Rojana Saman',
    icon: '🛒',
    description: 'Daily grocery essentials',
    displayOrder: 3,
    isActive: true
  },
  {
    name: 'Dairy Products',
    hindiName: 'Milk aur Eggs',
    icon: '🥛',
    description: 'Milk, eggs, butter, and dairy products',
    displayOrder: 4,
    isActive: true
  },
  {
    name: 'Gas Cylinder',
    hindiName: 'Cooking Gas',
    icon: '🔥',
    description: 'LPG gas cylinder booking',
    displayOrder: 5,
    isActive: true
  },
  {
    name: 'Jan Seva Kendra',
    hindiName: 'Sarkari Services',
    icon: '📋',
    description: 'Government services and documentation',
    displayOrder: 6,
    isActive: true
  }
];

// Sample Users
const users = [
  {
    name: 'Chandra Shekhar',
    email: 'chandra@chandradukan.com',
    phone: '7465073957',
    password: 'admin123',
    role: 'admin',
    address: {
      street: 'Main Market',
      city: 'Nawalpur Beyora',
      state: 'Uttar Pradesh',
      pincode: '226001',
      landmark: 'Near Temple'
    },
    isVerified: true
  },
  {
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '9876543211',
    password: 'customer123',
    role: 'customer',
    address: {
      street: 'Gandhi Nagar',
      city: 'Nawalpur Beyora',
      state: 'Uttar Pradesh',
      pincode: '226001'
    },
    isVerified: true
  }
];

// Function to create sample products for a category
const createProducts = (categoryId, categoryName) => {
  const productsByCategory = {
    'Cold Drinks & Beverages': [
      { name: 'Coca Cola 600ml', price: 40, stock: 25, unit: 'bottle', image: 'https://via.placeholder.com/200x200?text=Coca+Cola' },
      { name: 'Pepsi 600ml', price: 40, stock: 20, unit: 'bottle', image: 'https://via.placeholder.com/200x200?text=Pepsi' },
      { name: 'Sprite 600ml', price: 40, stock: 30, unit: 'bottle', image: 'https://via.placeholder.com/200x200?text=Sprite' },
      { name: 'Thumbs Up 600ml', price: 40, stock: 15, unit: 'bottle', image: 'https://via.placeholder.com/200x200?text=Thumbs+Up' },
      { name: 'Frooti Mango Drink 200ml', price: 20, stock: 50, unit: 'pack', image: 'https://via.placeholder.com/200x200?text=Frooti' }
    ],
    'Namkeen & Snacks': [
      { name: 'Lays Chips Classic', price: 20, stock: 40, unit: 'packet', image: 'https://via.placeholder.com/200x200?text=Lays' },
      { name: 'Kurkure Masala Munch', price: 20, stock: 35, unit: 'packet', image: 'https://via.placeholder.com/200x200?text=Kurkure' },
      { name: 'Parle-G Biscuit', price: 10, stock: 100, unit: 'packet', image: 'https://via.placeholder.com/200x200?text=Parle-G' },
      { name: 'Haldiram Bhujia', price: 50, stock: 25, unit: 'packet', image: 'https://via.placeholder.com/200x200?text=Bhujia' },
      { name: 'Good Day Biscuit', price: 30, stock: 45, unit: 'packet', image: 'https://via.placeholder.com/200x200?text=Good+Day' }
    ],
    'Daily Essentials': [
      { name: 'Tata Salt 1kg', price: 25, stock: 60, unit: 'packet', image: 'https://via.placeholder.com/200x200?text=Tata+Salt' },
      { name: 'Fortune Sunflower Oil 1L', price: 150, stock: 30, unit: 'bottle', image: 'https://via.placeholder.com/200x200?text=Fortune+Oil' },
      { name: 'Aashirvaad Atta 5kg', price: 250, stock: 20, unit: 'bag', image: 'https://via.placeholder.com/200x200?text=Atta' },
      { name: 'Toor Dal 1kg', price: 120, stock: 40, unit: 'packet', image: 'https://via.placeholder.com/200x200?text=Toor+Dal' },
      { name: 'Basmati Rice 5kg', price: 400, stock: 15, unit: 'bag', image: 'https://via.placeholder.com/200x200?text=Rice' }
    ],
    'Dairy Products': [
      { name: 'Amul Milk 500ml', price: 30, stock: 50, unit: 'packet', image: 'https://via.placeholder.com/200x200?text=Amul+Milk' },
      { name: 'Amul Butter 100g', price: 60, stock: 35, unit: 'packet', image: 'https://via.placeholder.com/200x200?text=Amul+Butter' },
      { name: 'Fresh Eggs (6 pcs)', price: 40, stock: 80, unit: 'tray', image: 'https://via.placeholder.com/200x200?text=Eggs' },
      { name: 'Amul Cheese Slice', price: 120, stock: 25, unit: 'packet', image: 'https://via.placeholder.com/200x200?text=Cheese' },
      { name: 'Dahi 400g', price: 35, stock: 40, unit: 'cup', image: 'https://via.placeholder.com/200x200?text=Dahi' }
    ],
    'Gas Cylinder': [
      { name: 'HP Gas 14.2kg', price: 850, stock: 10, unit: 'cylinder', image: 'https://via.placeholder.com/200x200?text=HP+Gas' },
      { name: 'Indane Gas 14.2kg', price: 850, stock: 8, unit: 'cylinder', image: 'https://via.placeholder.com/200x200?text=Indane+Gas' },
      { name: 'Bharat Gas 14.2kg', price: 850, stock: 12, unit: 'cylinder', image: 'https://via.placeholder.com/200x200?text=Bharat+Gas' }
    ]
  };

  const categoryProducts = productsByCategory[categoryName] || [];
  
  return categoryProducts.map(p => ({
    ...p,
    category: categoryId,
    description: `High quality ${p.name}`,
    isActive: true,
    isFeatured: Math.random() > 0.7 // 30% chance of being featured
  }));
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Seed Users
    console.log('👥 Seeding users...');
    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users\n`);

    // Seed Categories
    console.log('📂 Seeding categories...');
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories\n`);

    // Seed Products
    console.log('📦 Seeding products...');
    let allProducts = [];
    
    for (const category of createdCategories) {
      if (category.name !== 'Jan Seva Kendra') {
        const products = createProducts(category._id, category.name);
        allProducts = [...allProducts, ...products];
      }
    }
    
    const createdProducts = await Product.insertMany(allProducts);
    console.log(`✅ Created ${createdProducts.length} products\n`);

    // Update category product counts
    console.log('🔄 Updating category product counts...');
    for (const category of createdCategories) {
      await Category.updateProductCount(category._id);
    }
    console.log('✅ Category counts updated\n');

    // Summary
    console.log('📊 Seeding Summary:');
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Categories: ${createdCategories.length}`);
    console.log(`   Products: ${createdProducts.length}`);
    console.log('\n✨ Database seeding completed successfully!\n');

    // Display admin credentials
    console.log('🔐 Admin Credentials:');
    console.log('   Email: chandra@chandradukan.com');
    console.log('   Phone: 7465073957');
    console.log('   Password: admin123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error(error);
    process.exit(1);
  }
};

// Run seeding
connectDB().then(seedDatabase);
