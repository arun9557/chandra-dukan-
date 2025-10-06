# 🧪 Testing Guide - Chandra Dukan
# चंद्रा दुकान - टेस्टिंग गाइड

Complete testing guide for local development and production deployment.

---

## 📋 Table of Contents
1. [Local Testing Setup](#local-testing-setup)
2. [Backend Testing](#backend-testing)
3. [Frontend Testing](#frontend-testing)
4. [Integration Testing](#integration-testing)
5. [Mobile App Testing](#mobile-app-testing)
6. [Admin Panel Testing](#admin-panel-testing)
7. [Performance Testing](#performance-testing)
8. [Security Testing](#security-testing)

---

## 🏠 Local Testing Setup

### Prerequisites
```bash
# Check Node.js version (18+ required)
node --version

# Check npm version
npm --version

# Check Git
git --version
```

### Initial Setup
```bash
# Clone repository
git clone https://github.com/arun9557/chandra-dukan-.git
cd chandra-dukan-

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies (if needed)
cd ../frontend
npm install

# Return to root
cd ..
```

### Environment Configuration

#### Backend Environment (.env)
Create `backend/.env`:
```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/chandra-dukan
# OR use MongoDB Atlas for testing
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chandra-dukan

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# CORS
FRONTEND_URL=http://localhost:8000

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads

# Notifications (Optional for testing)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-number

# Email (Optional for testing)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

#### Frontend Environment
Create `frontend/.env` (if using build tools):
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Chandra Dukan
VITE_APP_VERSION=1.0.0
```

---

## 🖥️ Backend Testing

### 1. Start Backend Server
```bash
cd backend

# Development mode with auto-reload
npm run dev

# OR production mode
npm start
```

Expected output:
```
🚀 Server running on port 3000
✅ MongoDB connected successfully
```

### 2. Test API Endpoints

#### Health Check
```bash
curl http://localhost:3000/api/health
```
Expected: `{"status":"ok","timestamp":"..."}`

#### Products API
```bash
# Get all products
curl http://localhost:3000/api/products

# Get product by ID
curl http://localhost:3000/api/products/1

# Create product (requires auth)
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 99,
    "category": "Test",
    "stock": 10
  }'
```

#### Categories API
```bash
# Get all categories
curl http://localhost:3000/api/categories

# Create category
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Category",
    "icon": "🧪",
    "description": "Test category"
  }'
```

#### Orders API
```bash
# Get all orders
curl http://localhost:3000/api/orders

# Create order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "Test User",
      "phone": "9876543210",
      "address": "Test Address"
    },
    "items": [
      {"productId": 1, "quantity": 2, "price": 29}
    ],
    "total": 58,
    "paymentMethod": "COD"
  }'

# Update order status
curl -X PATCH http://localhost:3000/api/orders/ORDER_ID \
  -H "Content-Type: application/json" \
  -d '{"status": "confirmed"}'
```

#### Customers API
```bash
# Get all customers
curl http://localhost:3000/api/customers

# Get customer by phone
curl http://localhost:3000/api/customers/9876543210
```

#### Analytics API
```bash
# Get dashboard stats
curl http://localhost:3000/api/analytics/dashboard

# Get sales data
curl http://localhost:3000/api/analytics/sales?period=week
```

### 3. Database Testing

#### Connect to MongoDB
```bash
# If using local MongoDB
mongosh mongodb://localhost:27017/chandra-dukan

# If using MongoDB Atlas
mongosh "mongodb+srv://cluster.mongodb.net/chandra-dukan" --username your-username
```

#### Check Collections
```javascript
// Show all collections
show collections

// Count documents
db.products.countDocuments()
db.orders.countDocuments()
db.customers.countDocuments()

// Find sample data
db.products.find().limit(5)
db.orders.find().sort({createdAt: -1}).limit(5)
```

### 4. Run Backend Tests
```bash
cd backend

# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- routes/products.test.js
```

---

## 🎨 Frontend Testing

### 1. Start Frontend Server
```bash
cd frontend

# Using Python
python -m http.server 8000

# OR using Node.js
npx http-server -p 8000

# OR using live-server (auto-reload)
npx live-server --port=8000
```

Open browser: http://localhost:8000

### 2. Manual Testing Checklist

#### ✅ Homepage
- [ ] Page loads without errors
- [ ] Header displays correctly
- [ ] Search bar is functional
- [ ] Categories are visible
- [ ] Products load and display
- [ ] Cart icon shows correct count

#### ✅ Product Browsing
- [ ] All products display with images
- [ ] Prices show with ₹ symbol
- [ ] Stock status is visible
- [ ] "Add to Cart" button works
- [ ] Category filtering works
- [ ] Search functionality works
- [ ] Product details are accurate

#### ✅ Cart Functionality
- [ ] Cart modal opens
- [ ] Items display correctly
- [ ] Quantity can be increased/decreased
- [ ] Items can be removed
- [ ] Total price calculates correctly
- [ ] Delivery charges apply correctly
- [ ] Cart persists on page reload

#### ✅ Checkout Process
- [ ] Checkout modal opens
- [ ] Customer form validates input
- [ ] Phone number validation works
- [ ] Address is required
- [ ] Payment methods display
- [ ] Order summary is correct
- [ ] Order placement works
- [ ] Confirmation modal shows

#### ✅ Order Tracking
- [ ] Order confirmation displays
- [ ] Order ID is generated
- [ ] Status updates work
- [ ] WhatsApp link works (if configured)

#### ✅ Dashboard
- [ ] Dashboard opens
- [ ] Orders list displays
- [ ] Order details show correctly
- [ ] Status can be updated
- [ ] Analytics display
- [ ] Inventory management works

### 3. Browser Compatibility Testing

Test on multiple browsers:
```bash
# Chrome/Chromium
google-chrome http://localhost:8000

# Firefox
firefox http://localhost:8000

# Safari (macOS)
open -a Safari http://localhost:8000
```

Check:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

### 4. Responsive Design Testing

Test different screen sizes:
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Mobile (414x896)

Use Chrome DevTools:
```
F12 → Toggle Device Toolbar (Ctrl+Shift+M)
```

### 5. PWA Testing

#### Service Worker
```bash
# Open DevTools → Application → Service Workers
# Check if service worker is registered
```

#### Offline Functionality
```bash
# Open DevTools → Network → Offline
# Test if app works offline
```

#### Install Prompt
```bash
# Check if "Add to Home Screen" prompt appears
# Test installation on mobile device
```

---

## 🔗 Integration Testing

### Complete User Flow Testing

#### Test Scenario 1: New Customer Order
```bash
# 1. Start both servers
cd backend && npm run dev &
cd frontend && python -m http.server 8000 &

# 2. Open browser
# 3. Browse products
# 4. Add 3-5 items to cart
# 5. Open cart and verify items
# 6. Proceed to checkout
# 7. Fill customer details
# 8. Select payment method
# 9. Place order
# 10. Verify order confirmation
# 11. Check backend logs for order creation
# 12. Check database for new order
```

#### Test Scenario 2: Order Management
```bash
# 1. Open dashboard
# 2. View all orders
# 3. Update order status
# 4. Verify status update in database
# 5. Check if customer receives notification
```

#### Test Scenario 3: Inventory Management
```bash
# 1. Add new product via dashboard
# 2. Update product stock
# 3. Verify changes in frontend
# 4. Place order with low stock item
# 5. Check if stock decreases
```

### API Integration Testing

Create test script `test-integration.sh`:
```bash
#!/bin/bash

API_URL="http://localhost:3000/api"

echo "🧪 Testing API Integration..."

# Test 1: Create Product
echo "1. Creating product..."
PRODUCT_ID=$(curl -s -X POST $API_URL/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","price":99,"category":"Test","stock":10}' \
  | jq -r '.id')
echo "✅ Product created: $PRODUCT_ID"

# Test 2: Get Product
echo "2. Fetching product..."
curl -s $API_URL/products/$PRODUCT_ID | jq
echo "✅ Product fetched"

# Test 3: Create Order
echo "3. Creating order..."
ORDER_ID=$(curl -s -X POST $API_URL/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer":{"name":"Test","phone":"9876543210","address":"Test"},
    "items":[{"productId":'$PRODUCT_ID',"quantity":2,"price":99}],
    "total":198,
    "paymentMethod":"COD"
  }' | jq -r '.orderId')
echo "✅ Order created: $ORDER_ID"

# Test 4: Update Order
echo "4. Updating order status..."
curl -s -X PATCH $API_URL/orders/$ORDER_ID \
  -H "Content-Type: application/json" \
  -d '{"status":"confirmed"}' | jq
echo "✅ Order updated"

echo "🎉 Integration tests completed!"
```

Run:
```bash
chmod +x test-integration.sh
./test-integration.sh
```

---

## 📱 Mobile App Testing

### Setup Expo Development
```bash
cd mobile

# Install dependencies
npm install

# Start Expo
npx expo start
```

### Test on Physical Device
```bash
# Install Expo Go app on your phone
# Scan QR code from terminal
# Test all features
```

### Test on Emulator
```bash
# Android
npx expo start --android

# iOS (macOS only)
npx expo start --ios
```

### Mobile Testing Checklist
- [ ] App launches successfully
- [ ] Login/signup works
- [ ] Product browsing is smooth
- [ ] Cart functionality works
- [ ] Checkout process completes
- [ ] Push notifications work
- [ ] Offline mode works
- [ ] Camera/gallery access works

---

## 👨‍💼 Admin Panel Testing

### Access Admin Panel
```bash
# Open admin panel
open http://localhost:8000/admin/index.html
```

### Admin Testing Checklist
- [ ] Login works
- [ ] Dashboard displays stats
- [ ] Product management works
  - [ ] Add product
  - [ ] Edit product
  - [ ] Delete product
  - [ ] Upload image
- [ ] Category management works
- [ ] Order management works
  - [ ] View orders
  - [ ] Update status
  - [ ] View details
- [ ] Customer management works
- [ ] Analytics display correctly

---

## ⚡ Performance Testing

### Load Testing with Apache Bench
```bash
# Install Apache Bench
sudo apt-get install apache2-utils  # Ubuntu/Debian
brew install httpd  # macOS

# Test API endpoint
ab -n 1000 -c 10 http://localhost:3000/api/products

# Test with POST
ab -n 100 -c 5 -p order.json -T application/json \
  http://localhost:3000/api/orders
```

### Lighthouse Testing
```bash
# Install Lighthouse
npm install -g lighthouse

# Run Lighthouse
lighthouse http://localhost:8000 --view

# Check scores:
# - Performance
# - Accessibility
# - Best Practices
# - SEO
# - PWA
```

### Performance Metrics to Check
- [ ] Page load time < 3s
- [ ] Time to Interactive < 5s
- [ ] First Contentful Paint < 2s
- [ ] API response time < 500ms
- [ ] Database query time < 100ms

---

## 🔒 Security Testing

### Security Checklist
- [ ] HTTPS enabled (production)
- [ ] CORS configured correctly
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Rate limiting enabled
- [ ] Input validation
- [ ] Authentication working
- [ ] Authorization working
- [ ] Secure headers set

### Test Security Headers
```bash
curl -I http://localhost:3000/api/health

# Should include:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
```

### Test Rate Limiting
```bash
# Send multiple requests quickly
for i in {1..100}; do
  curl http://localhost:3000/api/products &
done

# Should see 429 Too Many Requests after limit
```

---

## 🐛 Debugging Tips

### Backend Debugging
```bash
# Enable debug mode
DEBUG=* npm run dev

# Check logs
tail -f logs/app.log

# MongoDB queries
# Add to server.js:
mongoose.set('debug', true);
```

### Frontend Debugging
```javascript
// Open browser console (F12)
// Check for errors
console.log('Debug info:', data);

// Network tab
// Check API calls and responses

// Application tab
// Check localStorage, sessionStorage
// Check service worker status
```

### Common Issues

#### CORS Error
```bash
# Backend: Check CORS configuration
# Frontend: Verify API URL
```

#### Database Connection Failed
```bash
# Check MongoDB is running
sudo systemctl status mongod

# Check connection string
echo $MONGODB_URI
```

#### Port Already in Use
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

---

## ✅ Pre-Deployment Testing Checklist

### Backend
- [ ] All API endpoints working
- [ ] Database connected
- [ ] Environment variables set
- [ ] Error handling works
- [ ] Logging configured
- [ ] Tests passing
- [ ] No console errors
- [ ] Security headers set

### Frontend
- [ ] All pages load correctly
- [ ] No console errors
- [ ] API integration works
- [ ] Forms validate correctly
- [ ] Responsive on all devices
- [ ] PWA features work
- [ ] Images optimized
- [ ] Performance acceptable

### Integration
- [ ] Complete user flow works
- [ ] Order placement successful
- [ ] Payment processing works
- [ ] Notifications sent
- [ ] Data persists correctly
- [ ] Error handling works

---

## 📊 Test Reports

### Generate Test Report
```bash
cd backend

# Run tests with coverage
npm test -- --coverage --coverageReporters=html

# Open report
open coverage/index.html
```

### Performance Report
```bash
# Generate Lighthouse report
lighthouse http://localhost:8000 \
  --output html \
  --output-path ./reports/lighthouse-report.html

# Open report
open reports/lighthouse-report.html
```

---

## 🎯 Next Steps

After all tests pass:
1. ✅ Commit changes
2. ✅ Push to repository
3. ✅ Deploy to staging
4. ✅ Run tests on staging
5. ✅ Deploy to production
6. ✅ Monitor production

---

## 📞 Support

If you encounter issues:
- Check logs: `backend/logs/`
- Review error messages
- Check GitHub issues
- Contact: chandra.shekhar@example.com

---

**Happy Testing! 🎉**

*सफलता के लिए परीक्षण आवश्यक है - Testing is essential for success*
