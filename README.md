# 🏪 Chandra Dukan - Local Grocery Delivery App
# चंद्रा दुकान - स्थानीय किराना डिलीवरी ऐप

A modern, modular grocery delivery application built with vanilla JavaScript, featuring a warm Indian design and comprehensive e-commerce functionality.

## ✨ Features

### 🛒 Core Features
- **Product Catalog** - Categories with Hindi-English labels
- **Shopping Cart** - Add/remove items, quantity management
- **Checkout Process** - Customer details, payment options
- **Order Tracking** - Real-time order status updates
- **Dashboard** - Store owner analytics and management

### 🎨 Modern Design
- **Warm Indian Theme** - Orange, yellow, and green color palette
- **Mobile-First UI** - Responsive design for all devices
- **Indian Elements** - Rupee symbol, Hindi-English mixed labels
- **Smooth Animations** - Modern transitions and effects

### 📱 Technical Features
- **Modular Architecture** - Component-based structure
- **Service Layer** - Cart, notifications, data management
- **PWA Support** - Offline functionality, push notifications
- **Backend API** - Node.js/Express with MongoDB
- **Real-time Updates** - Live order tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Modern web browser
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/chandra-dukan.git
cd chandra-dukan
```

2. **Start the application**
```bash
# Frontend only (for development)
cd frontend
python -m http.server 8000
# Open http://localhost:8000

# Full stack (with backend)
cd backend
npm install
npm start
# Backend runs on http://localhost:3000
```

3. **Test the application**
- Open http://localhost:8000
- Browse products
- Add items to cart
- Place an order
- Check dashboard

## 📁 Project Structure

```
chandra-dukan/
├── frontend/
│   ├── components/          # UI Components
│   │   ├── Header.js
│   │   ├── SearchBar.js
│   │   ├── ProductCard.js
│   │   ├── CartModal.js
│   │   ├── CheckoutModal.js
│   │   ├── OrderConfirmModal.js
│   │   └── Dashboard.js
│   ├── services/           # Business Logic
│   │   ├── CartService.js
│   │   ├── NotificationService.js
│   │   └── DataService.js
│   ├── utils/              # Utilities
│   │   └── helpers.js
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   ├── manifest.json
│   └── sw.js
├── backend/
│   ├── routes/             # API Routes
│   │   ├── orders.js
│   │   ├── products.js
│   │   ├── customers.js
│   │   ├── notifications.js
│   │   └── analytics.js
│   ├── models/             # Database Models
│   ├── middleware/         # Custom Middleware
│   ├── server.js
│   └── package.json
├── admin/                 # Admin dashboard (to be added)
├── assets/                # Shared images/icons (to be added)
└── DEPLOYMENT.md
```

## 🛠️ Development

### Frontend Development
```bash
cd frontend
# Use any static server
python -m http.server 8000
# Or
npx live-server
```

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### Testing
```bash
# Test frontend
curl http://localhost:8000

# Test backend
curl http://localhost:3000/api/health

# Test complete flow
# 1. Add products to cart
# 2. Place order
# 3. Check order status
```

## 🎯 Key Components

### 1. Header Component
- Store branding
- Cart icon with badge
- Dashboard toggle
- Status indicators

### 2. Search & Filter
- Product search
- Category filtering
- Price sorting
- Stock availability

### 3. Product Cards
- Product images
- Price display with ₹ symbol
- Stock status
- Add to cart functionality

### 4. Cart Management
- Add/remove items
- Quantity updates
- Price calculations
- Delivery charges

### 5. Checkout Process
- Customer information
- Address validation
- Payment options (COD, UPI, PhonePe)
- Order summary

### 6. Dashboard
- Order management
- Inventory tracking
- Sales analytics
- Customer insights

## 🔧 Configuration

### Environment Variables
```bash
# Frontend
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Chandra Dukan

# Backend
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/chandra-dukan
JWT_SECRET=your-secret-key
```

### Customization
- Update store information in `DataService.js`
- Modify colors in `style.css`
- Add new products in backend
- Configure delivery areas

## 📱 Mobile Features

### PWA Support
- Installable app
- Offline functionality
- Push notifications
- Background sync

### Mobile UI
- Touch-friendly buttons
- Swipe gestures
- Responsive layout
- Fast loading

## 🔔 Notifications

### Push Notifications
- Order confirmations
- Status updates
- Promotional messages
- Low stock alerts

### WhatsApp Integration
- Order notifications
- Customer support
- Status updates
- Delivery confirmations

## 📊 Analytics

### Store Dashboard
- Total orders
- Revenue tracking
- Popular products
- Customer insights

### Order Analytics
- Order status tracking
- Delivery time analysis
- Payment method preferences
- Geographic distribution

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm i -g vercel
vercel --prod
```

### Backend (Vercel/Railway)
```bash
# Configure vercel.json
vercel --prod
```

### Database (MongoDB Atlas)
1. Create cluster
2. Get connection string
3. Update environment variables

## 🧪 Testing

### Manual Testing
1. **Product Browsing**
   - Load products
   - Filter by category
   - Search functionality
   - Sort options

2. **Cart Functionality**
   - Add items
   - Update quantities
   - Remove items
   - Price calculations

3. **Checkout Process**
   - Customer details
   - Address validation
   - Payment selection
   - Order confirmation

4. **Dashboard**
   - Order management
   - Inventory updates
   - Analytics display

### Automated Testing
```bash
# Backend tests
cd backend
npm test

# Frontend tests (if implemented)
cd frontend
npm test
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check backend CORS configuration
   - Verify frontend URL

2. **API Not Found**
   - Check API endpoints
   - Verify server running

3. **Database Connection**
   - Check MongoDB URI
   - Verify network access

4. **Build Failures**
   - Check Node.js version
   - Clear npm cache

### Debug Commands
```bash
# Check Node version
node --version

# Check dependencies
npm list

# Clear cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

### Code Style
- Use meaningful variable names
- Add comments in Hindi-English
- Follow modular structure
- Test all functionality

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

### Contact Information
- **Owner**: Chandra Shekhar
- **Phone**: +91 98765 43210
- **WhatsApp**: +91 98765 43210
- **Email**: chandra.shekhar@example.com

### Documentation
- [Deployment Guide](DEPLOYMENT.md)
- [API Documentation](backend/README.md)
- [Component Guide](frontend/README.md)

## 🎉 Success Stories

### Features Implemented
✅ Modular component structure  
✅ Modern Indian e-commerce design  
✅ Complete cart functionality  
✅ Order management system  
✅ Dashboard with analytics  
✅ Push notifications  
✅ WhatsApp integration  
✅ PWA support  
✅ Backend API  
✅ Deployment ready  

### Next Steps
- Real-time updates
- Advanced analytics
- Multi-language support
- Mobile app
- Advanced search
- Recommendation engine

---

**Made with ❤️ for the community by Chandra Shekhar**

*आपके घर तक, जल्दी और आसान - Your home, fast and easy*
