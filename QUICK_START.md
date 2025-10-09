# 🚀 Chandra Dukan - Quick Start Guide

## ⚡ **Get Started in 5 Minutes!**

---

## 📋 **Prerequisites Check**

```bash
# Check Node.js (need 18+)
node --version

# Check npm
npm --version

# Check Python (for frontend server)
python3 --version
```

---

## 🎯 **Option 1: Quick Start with MongoDB Atlas (Recommended)**

### **Step 1: Get MongoDB Atlas (5 minutes)**

1. **Sign up:** https://www.mongodb.com/cloud/atlas/register
2. **Create FREE cluster** (M0 Sandbox)
3. **Create database user:**
   - Username: `chandradukan`
   - Password: (generate and save)
4. **Whitelist IP:** `0.0.0.0/0` (allow all)
5. **Get connection string:**
   ```
   mongodb+srv://chandradukan:PASSWORD@cluster.mongodb.net/chandra-dukan
   ```

### **Step 2: Configure Backend**

```bash
cd /home/user/Desktop/chanda-app/backend

# Create .env file
cat > .env << 'EOF'
# MongoDB Connection
MONGODB_URI=mongodb+srv://chandradukan:YOUR_PASSWORD@cluster.mongodb.net/chandra-dukan?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=chandra-dukan-super-secret-key-2025-production-ready

# Server Config
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:8000
EOF

# Replace YOUR_PASSWORD with your actual password
nano .env
```

### **Step 3: Install & Test**

```bash
# Install dependencies (if not done)
npm install

# Test database connection
npm run test:db

# Seed database with sample data
npm run seed

# Start backend server
npm start
```

**Expected Output:**
```
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
📊 Database: chandra-dukan
🚀 Chandra Dukan Backend running on 0.0.0.0:3000
```

### **Step 4: Start Frontend**

Open **new terminal:**

```bash
cd /home/user/Desktop/chanda-app/frontend
python3 -m http.server 8000
```

### **Step 5: Test Everything**

Open browser:
- **Main Site:** http://localhost:8000
- **Login:** http://localhost:8000/login.html
- **Admin Dashboard:** http://localhost:8000/account.html

**Login with:**
```
Email: chandra@chandradukan.com
Password: admin123
```

---

## 🎯 **Option 2: Quick Start with Local MongoDB**

### **Step 1: Install MongoDB**

**Ubuntu/Debian:**
```bash
# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Check status
sudo systemctl status mongodb
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### **Step 2: Configure Backend**

```bash
cd /home/user/Desktop/chanda-app/backend

# Create .env file
cat > .env << 'EOF'
# MongoDB Connection (Local)
MONGODB_URI=mongodb://localhost:27017/chandra-dukan

# JWT Secret
JWT_SECRET=chandra-dukan-super-secret-key-2025-production-ready

# Server Config
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:8000
EOF
```

### **Step 3: Install & Test**

```bash
# Install dependencies
npm install

# Test database connection
npm run test:db

# Seed database
npm run seed

# Start backend
npm start
```

### **Step 4: Start Frontend**

```bash
cd /home/user/Desktop/chanda-app/frontend
python3 -m http.server 8000
```

### **Step 5: Test**

Open: http://localhost:8000/login.html

---

## 🧪 **Verification Checklist**

### **Backend Verification:**

```bash
# 1. Health check
curl http://localhost:3000/api/health

# Expected: {"status":"OK",...}

# 2. Get categories
curl http://localhost:3000/api/categories

# Expected: {"success":true,"count":6,...}

# 3. Get products
curl http://localhost:3000/api/products

# Expected: {"success":true,"count":23,...}

# 4. Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"chandra@chandradukan.com","password":"admin123"}'

# Expected: {"success":true,"data":{"token":"..."}}
```

### **Frontend Verification:**

- [ ] Main page loads: http://localhost:8000
- [ ] Products are displayed
- [ ] Categories are shown
- [ ] Login page works: http://localhost:8000/login.html
- [ ] Can login with admin credentials
- [ ] Account page shows user info
- [ ] Cart functionality works
- [ ] Search works

---

## 🎨 **Default Accounts**

### **Admin Account:**
```
Email: chandra@chandradukan.com
Phone: 7465073957
Password: admin123
Role: admin
```

### **Customer Account:**
```
Email: rajesh@example.com
Phone: 9876543211
Password: customer123
Role: customer
```

---

## 📊 **What You Get After Seeding**

| Collection | Count | Description |
|------------|-------|-------------|
| **users** | 2 | Admin + Customer |
| **categories** | 6 | Product categories |
| **products** | 23 | Grocery items |
| **orders** | 0 | Created on purchase |

### **Categories:**
- 🥤 Cold Drinks & Beverages (5 products)
- 🍪 Namkeen & Snacks (5 products)
- 🛒 Daily Essentials (5 products)
- 🥛 Dairy Products (5 products)
- 🔥 Gas Cylinder (3 products)
- 📋 Jan Seva Kendra (services)

---

## 🔧 **Troubleshooting**

### **Problem: Backend won't start**

```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process if needed
kill -9 <PID>

# Or use different port
PORT=3001 npm start
```

### **Problem: MongoDB connection failed**

```bash
# Check MongoDB status (local)
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### **Problem: Frontend won't start**

```bash
# Check if port 8000 is in use
lsof -i :8000

# Use different port
python3 -m http.server 8001
```

### **Problem: CORS errors**

Check `.env` file:
```env
FRONTEND_URL=http://localhost:8000
```

Restart backend after changing.

---

## 📱 **Mobile App (Optional)**

Your project also has a React Native mobile app!

```bash
cd /home/user/Desktop/chanda-app/mobile

# Install dependencies
npm install

# Start Expo
npm start

# Scan QR code with Expo Go app
```

---

## 🎯 **Next Steps**

After successful setup:

1. ✅ **Explore the website**
   - Browse products
   - Add to cart
   - Place test order

2. ✅ **Test authentication**
   - Register new user
   - Login/logout
   - Update profile

3. ✅ **Test admin features**
   - Login as admin
   - View dashboard
   - Manage orders

4. ✅ **Customize**
   - Update store name
   - Change colors
   - Add your products
   - Update contact info

---

## 📚 **Documentation**

- `MONGODB_INTEGRATION_COMPLETE.md` - MongoDB details
- `AUTHENTICATION_COMPLETE.md` - Auth system details
- `MONGODB_SETUP_GUIDE.md` - Detailed MongoDB setup
- `TEST_AUTHENTICATION.md` - API testing guide
- `PROJECT_COMPLETE_SUMMARY.md` - Full project overview
- `README.md` - Project documentation

---

## 🆘 **Common Commands**

```bash
# Backend
cd backend
npm install          # Install dependencies
npm run test:db      # Test database connection
npm run seed         # Seed database
npm start            # Start server
npm run dev          # Start with nodemon (auto-reload)

# Frontend
cd frontend
python3 -m http.server 8000    # Start frontend

# Database
npm run test:db      # Test connection
npm run seed         # Seed data
npm run seed:fresh   # Fresh seed (clears data)

# Logs
tail -f backend/logs/app.log   # View backend logs
```

---

## 🎉 **Success Indicators**

You'll know everything is working when:

✅ Backend starts without errors
✅ Database connection successful
✅ Frontend loads at http://localhost:8000
✅ Products are displayed
✅ Login works
✅ API endpoints respond
✅ No CORS errors in browser console

---

## 📞 **Need Help?**

1. **Check error messages** carefully
2. **Verify .env file** has correct values
3. **Test database connection** first
4. **Check logs** for detailed errors
5. **Restart services** after config changes

---

## 🌟 **Pro Tips**

💡 **Use MongoDB Atlas** for hassle-free setup
💡 **Keep terminal open** to see logs
💡 **Use Chrome DevTools** to debug frontend
💡 **Test API with Postman** for better debugging
💡 **Check browser console** for errors

---

## ⚡ **One-Line Setup (if everything is ready)**

```bash
cd backend && npm run seed && npm start & cd ../frontend && python3 -m http.server 8000
```

---

## 🎊 **You're All Set!**

Your **Chandra Dukan** e-commerce platform is ready to use!

**Features Available:**
✅ Product catalog
✅ Shopping cart
✅ User authentication
✅ Order management
✅ Admin dashboard
✅ Payment integration
✅ Mobile responsive
✅ PWA support

**Start building your grocery delivery business! 🚀**

---

**Made with ❤️ for Chandra Dukan**
*आपके घर तक, जल्दी और आसान* 🏪
