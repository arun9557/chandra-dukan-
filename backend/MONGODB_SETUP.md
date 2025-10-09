# MongoDB Setup Guide for Chandra Dukan

Complete guide to set up MongoDB database for Chandra Dukan backend.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local MongoDB Setup](#local-mongodb-setup)
3. [MongoDB Atlas (Cloud) Setup](#mongodb-atlas-cloud-setup)
4. [Environment Configuration](#environment-configuration)
5. [Database Seeding](#database-seeding)
6. [Testing Connection](#testing-connection)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- MongoDB installed locally OR MongoDB Atlas account (cloud)

---

## Local MongoDB Setup

### Option 1: Install MongoDB on Ubuntu/Debian

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod

# Enable MongoDB to start on boot
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod
```

### Option 2: Using Docker

```bash
# Pull MongoDB image
docker pull mongo:latest

# Run MongoDB container
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -v mongodb_data:/data/db \
  mongo:latest

# Check if running
docker ps | grep mongodb
```

---

## MongoDB Atlas (Cloud) Setup

### Step 1: Create Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Verify your email

### Step 2: Create Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0 Sandbox)
3. Select your preferred cloud provider and region
4. Name your cluster (e.g., "chandra-dukan-cluster")
5. Click "Create Cluster" (takes 3-5 minutes)

### Step 3: Create Database User
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `chandradukan`
5. Password: Generate a strong password
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### Step 4: Whitelist IP Address
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your specific IP address
5. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `chandra-dukan`

Example:
```
mongodb+srv://chandradukan:yourpassword@cluster0.xxxxx.mongodb.net/chandra-dukan?retryWrites=true&w=majority
```

---

## Environment Configuration

### Step 1: Create .env file

```bash
cd backend
cp .env.example .env
```

### Step 2: Update .env file

**For Local MongoDB:**
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/chandra-dukan
JWT_SECRET=your-super-secret-jwt-key-change-this
FRONTEND_URL=http://localhost:8000
```

**For MongoDB Atlas:**
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb+srv://chandradukan:yourpassword@cluster0.xxxxx.mongodb.net/chandra-dukan?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this
FRONTEND_URL=http://localhost:8000
```

### Step 3: Generate Secure JWT Secret

```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET` in .env file.

---

## Database Seeding

### Test Database Connection First

```bash
npm run test:db
```

Expected output:
```
✅ MongoDB Connection Successful!
📊 Database: chandra-dukan
🌐 Host: localhost (or cluster address)
```

### Seed Database with Sample Data

```bash
npm run seed
```

This will:
- Clear existing data
- Create 2 sample users (1 admin, 1 customer)
- Create 6 categories
- Create 25+ sample products
- Update category product counts

**Admin Credentials:**
- Email: `chandra@chandradukan.com`
- Phone: `9876543210`
- Password: `admin123`

**Customer Credentials:**
- Email: `rajesh@example.com`
- Phone: `9876543211`
- Password: `customer123`

---

## Testing Connection

### Method 1: Using npm script

```bash
npm run test:db
```

### Method 2: Using MongoDB Compass (GUI)

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Install and open
3. Enter connection string
4. Click "Connect"
5. Browse collections: users, products, categories, orders

### Method 3: Using mongo shell

```bash
# Connect to local MongoDB
mongosh

# Or connect to Atlas
mongosh "mongodb+srv://cluster0.xxxxx.mongodb.net/chandra-dukan" --username chandradukan

# Show databases
show dbs

# Use chandra-dukan database
use chandra-dukan

# Show collections
show collections

# Count documents
db.users.countDocuments()
db.products.countDocuments()
db.categories.countDocuments()
```

---

## Start Backend Server

```bash
npm start
```

Expected output:
```
🔄 Connecting to MongoDB...
✅ MongoDB Connected: localhost
📊 Database: chandra-dukan
🚀 Chandra Dukan Backend running on 0.0.0.0:3000
```

---

## API Endpoints with MongoDB

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `PATCH /api/products/:id/stock` - Update stock
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status

---

## Troubleshooting

### Error: ECONNREFUSED

**Problem:** Cannot connect to MongoDB

**Solutions:**
1. Check if MongoDB is running:
   ```bash
   sudo systemctl status mongod
   ```

2. Start MongoDB:
   ```bash
   sudo systemctl start mongod
   ```

3. Check MongoDB logs:
   ```bash
   sudo tail -f /var/log/mongodb/mongod.log
   ```

### Error: Authentication Failed

**Problem:** Invalid credentials for MongoDB Atlas

**Solutions:**
1. Verify username and password in connection string
2. Check Database Access settings in Atlas
3. Ensure password doesn't contain special characters (URL encode if needed)

### Error: IP Not Whitelisted

**Problem:** Your IP is not allowed to access Atlas

**Solutions:**
1. Go to Network Access in Atlas
2. Add your current IP address
3. Or allow access from anywhere (0.0.0.0/0) for development

### Error: MongooseServerSelectionError

**Problem:** Cannot reach MongoDB server

**Solutions:**
1. Check internet connection (for Atlas)
2. Verify connection string format
3. Check firewall settings
4. Ensure MongoDB service is running (for local)

### Database Not Showing Data

**Problem:** Collections are empty

**Solutions:**
1. Run seeding script:
   ```bash
   npm run seed
   ```

2. Verify data was inserted:
   ```bash
   npm run test:db
   ```

---

## Database Models

### User Model
- Authentication with bcrypt password hashing
- JWT token generation
- Role-based access (customer, admin, delivery)
- Address management

### Product Model
- Category reference
- Stock management
- Price and discount calculation
- Featured products
- Search indexing

### Category Model
- Hierarchical structure (parent-child)
- Product count tracking
- Display order
- Hindi name support

### Order Model
- Auto-generated order numbers
- Order status tracking
- Payment integration
- Customer details
- Order history

### JanSeva Model
- Government service applications
- Document management
- Status tracking
- Application numbering

---

## Next Steps

1. ✅ MongoDB is connected
2. ✅ Database is seeded with sample data
3. ✅ API routes are using MongoDB
4. 🔄 Test API endpoints using Postman or curl
5. 🔄 Update frontend to use new API structure
6. 🔄 Implement authentication middleware
7. 🔄 Add order management features

---

## Useful Commands

```bash
# Test database connection
npm run test:db

# Seed database with sample data
npm run seed

# Start backend server
npm start

# Start with auto-reload (development)
npm run dev

# View MongoDB logs (local)
sudo tail -f /var/log/mongodb/mongod.log

# Backup database
mongodump --uri="mongodb://localhost:27017/chandra-dukan" --out=./backup

# Restore database
mongorestore --uri="mongodb://localhost:27017/chandra-dukan" ./backup/chandra-dukan
```

---

## Support

For issues or questions:
- Check [MongoDB Documentation](https://docs.mongodb.com/)
- Check [Mongoose Documentation](https://mongoosejs.com/docs/)
- Open an issue on GitHub
- Contact: chandra.shekhar@example.com

---

**Made with ❤️ for Chandra Dukan**
