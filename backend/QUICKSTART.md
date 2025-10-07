# 🚀 Quick Start - MongoDB Integration

Get your Chandra Dukan backend running with MongoDB in 5 minutes!

## Step 1: Install MongoDB (Choose One)

### Option A: Local MongoDB (Recommended for Development)

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Option B: MongoDB Atlas (Cloud - Free Tier)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (takes 3-5 min)
4. Get connection string

## Step 2: Configure Environment

```bash
# Copy environment file
cp .env.example .env

# Edit .env file
nano .env
```

**For Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/chandra-dukan
JWT_SECRET=your-secret-key-here
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chandra-dukan
JWT_SECRET=your-secret-key-here
```

## Step 3: Test Connection

```bash
npm run test:db
```

✅ Expected: "MongoDB Connection Successful!"

## Step 4: Seed Database

```bash
npm run seed
```

This creates:
- 2 users (1 admin, 1 customer)
- 6 categories
- 25+ products

**Admin Login:**
- Email: `chandra@chandradukan.com`
- Password: `admin123`

## Step 5: Start Server

```bash
npm start
```

✅ Server running on http://localhost:3000

## Step 6: Test API

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Get all products
curl http://localhost:3000/api/products

# Get all categories
curl http://localhost:3000/api/categories
```

## 🎉 Done!

Your MongoDB backend is ready!

### Next Steps:
1. Test authentication: `POST /api/auth/login`
2. Create products: `POST /api/products`
3. Place orders: `POST /api/orders`
4. Update frontend to use new API

### Troubleshooting:

**MongoDB not connecting?**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

**Need help?**
- Read: `MONGODB_SETUP.md` (detailed guide)
- Check: `backend/models/` (database schemas)
- Test: `npm run test:db`
