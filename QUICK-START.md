# 🚀 Quick Start Guide - Chandra Dukan
# चंद्रा दुकान - त्वरित शुरुआत गाइड

Get your grocery delivery app running in 5 minutes!

---

## ⚡ Super Quick Start (5 Minutes)

### 1. Clone & Setup (2 minutes)

```bash
# Clone repository
git clone https://github.com/arun9557/chandra-dukan-.git
cd chandra-dukan-

# Run setup script
chmod +x scripts/setup-local.sh
./scripts/setup-local.sh
```

### 2. Configure Environment (1 minute)

Edit `backend/.env`:
```bash
# Minimum required configuration
MONGODB_URI=mongodb://localhost:27017/chandra-dukan
# OR use MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chandra-dukan

JWT_SECRET=change-this-to-a-random-secret-key
```

### 3. Start Servers (1 minute)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
python -m http.server 8000
```

### 4. Open & Test (1 minute)

- **App:** http://localhost:8000
- **Admin:** http://localhost:8000/admin/
- **API:** http://localhost:3000/api/health

---

## 📱 What You Get

### Customer App
- Browse products by category
- Search functionality
- Add to cart
- Checkout & place orders
- Order tracking

### Admin Panel
- Dashboard with analytics
- Product management
- Order management
- Customer database
- Real-time updates

### Backend API
- RESTful API
- MongoDB database
- Authentication
- File uploads
- Notifications

---

## 🎯 First Steps After Setup

### 1. Add Products (Admin Panel)

1. Open http://localhost:8000/admin/
2. Go to **Products** section
3. Click **"Add Product"**
4. Fill details:
   - Name: "Amul Milk"
   - Price: 29
   - Category: "Dairy & Bread"
   - Stock: 50
5. Save

### 2. Test Order Flow

1. Open http://localhost:8000
2. Browse products
3. Add items to cart
4. Click cart icon
5. Proceed to checkout
6. Fill customer details
7. Place order
8. Check admin panel for new order

### 3. Explore Features

**Customer Side:**
- Search products
- Filter by category
- Update cart quantities
- Try different payment methods

**Admin Side:**
- View dashboard stats
- Update order status
- Manage inventory
- View customer list

---

## 🛠️ Common Commands

### Backend
```bash
cd backend

# Development (auto-reload)
npm run dev

# Production
npm start

# Run tests
npm test

# Check logs
tail -f logs/app.log
```

### Frontend
```bash
cd frontend

# Python server
python -m http.server 8000

# Node.js server
npx http-server -p 8000

# Live reload
npx live-server --port=8000
```

### Database
```bash
# Connect to local MongoDB
mongosh mongodb://localhost:27017/chandra-dukan

# View collections
show collections

# View products
db.products.find()

# View orders
db.orders.find().sort({createdAt: -1})
```

---

## 🧪 Testing

### Quick Test
```bash
# Run all tests
chmod +x scripts/test-all.sh
./scripts/test-all.sh
```

### Manual Test
```bash
# Test backend health
curl http://localhost:3000/api/health

# Test products API
curl http://localhost:3000/api/products

# Test order creation
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {"name": "Test", "phone": "9876543210", "address": "Test Address"},
    "items": [{"productId": 1, "quantity": 2, "price": 29}],
    "total": 78,
    "paymentMethod": "COD"
  }'
```

---

## 🚀 Deploy to Production

### Quick Deploy (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy backend
cd backend
vercel --prod

# Deploy frontend
cd ../frontend
vercel --prod
```

### Full Deployment Guide
See [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md) for complete steps.

---

## 📚 Documentation

- **[README.md](README.md)** - Project overview
- **[TESTING.md](TESTING.md)** - Complete testing guide
- **[API-DOCUMENTATION.md](API-DOCUMENTATION.md)** - API reference
- **[ADMIN-GUIDE.md](ADMIN-GUIDE.md)** - Admin user guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment guide
- **[DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md)** - Deployment checklist

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Node version (18+ required)
node --version

# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install

# Check MongoDB connection
mongosh $MONGODB_URI
```

### Frontend not loading
```bash
# Try different port
python -m http.server 8080

# Check if port is in use
lsof -i :8000

# Kill process using port
kill -9 <PID>
```

### CORS errors
```bash
# Check backend CORS configuration
# Ensure FRONTEND_URL in backend/.env matches frontend URL
FRONTEND_URL=http://localhost:8000
```

### Database connection failed
```bash
# Check MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Or use MongoDB Atlas
# Update MONGODB_URI in backend/.env
```

---

## 💡 Pro Tips

### Development
- Use `nodemon` for auto-reload: `npm run dev`
- Use `live-server` for frontend auto-reload
- Keep browser console open for debugging
- Use MongoDB Compass for database GUI

### Testing
- Test on multiple browsers
- Test on mobile devices
- Use Chrome DevTools device mode
- Test with slow network (DevTools → Network → Slow 3G)

### Performance
- Optimize images before upload
- Use lazy loading for images
- Enable compression
- Monitor API response times

---

## 🎓 Learning Resources

### Tutorials
- [Node.js Tutorial](https://nodejs.org/en/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Tutorial](https://docs.mongodb.com/manual/tutorial/)
- [JavaScript MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

### Videos
- Search YouTube for "Node.js REST API"
- Search YouTube for "MongoDB CRUD operations"
- Search YouTube for "Vanilla JavaScript projects"

---

## 📞 Get Help

### Community
- GitHub Issues: [Report bugs](https://github.com/arun9557/chandra-dukan-/issues)
- Discussions: [Ask questions](https://github.com/arun9557/chandra-dukan-/discussions)

### Contact
- Email: chandra.shekhar@example.com
- Phone: +91 98765 43210
- WhatsApp: +91 98765 43210

---

## ✅ Next Steps

After getting started:

1. **Customize** - Update store name, colors, logo
2. **Add Data** - Import your products and categories
3. **Test** - Complete end-to-end testing
4. **Deploy** - Push to production
5. **Launch** - Start taking orders!

---

## 🎉 Success!

You're now ready to run your own grocery delivery business!

**Need help?** Check the documentation or reach out to support.

**Ready to deploy?** Follow the [deployment checklist](DEPLOYMENT-CHECKLIST.md).

---

*आपके व्यापार की शुरुआत यहाँ से - Your business starts here*

**Made with ❤️ for local businesses**
