# Chandra Dukan - Deployment Guide
# चंद्रा दुकान - डिप्लॉयमेंट गाइड

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Git installed
- Vercel/Netlify account (for frontend)
- MongoDB Atlas account (for backend)

## 📱 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend
```bash
cd frontend
# Install dependencies (if any)
npm install
```

### Step 2: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Step 3: Configure Environment Variables
In Vercel dashboard, add these environment variables:
```
NODE_ENV=production
API_URL=https://your-backend-url.vercel.app
```

## 🖥️ Backend Deployment (Vercel)

### Step 1: Prepare Backend
```bash
cd backend
npm install
```

### Step 2: Create vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### Step 3: Deploy to Vercel
```bash
cd backend
vercel --prod
```

## 🌐 Alternative: Netlify Deployment

### Frontend on Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build` (or leave empty for static)
3. Set publish directory: `frontend`
4. Add environment variables in Netlify dashboard

### Backend on Railway/Render
1. Connect GitHub repository
2. Set start command: `npm start`
3. Add environment variables

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create cluster
3. Get connection string
4. Add to environment variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chandra-dukan
```

### Alternative: Firebase
1. Create project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore
3. Add service account key
4. Add to environment variables:
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
```

## 🔧 Environment Variables

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url.vercel.app
VITE_APP_NAME=Chandra Dukan
VITE_APP_VERSION=1.0.0
```

### Backend (.env)
```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-jwt-secret
FRONTEND_URL=https://your-frontend-url.vercel.app
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-number
```

## 📱 PWA Configuration

### Service Worker
The app includes a service worker for offline functionality:
- Caches static assets
- Handles push notifications
- Provides offline support

### Manifest
Update `manifest.json` with your app details:
```json
{
  "name": "Chandra Dukan",
  "short_name": "Chandra Dukan",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#ff6b35"
}
```

## 🧪 Testing Commands

### Frontend Testing
```bash
cd frontend
# Open in browser
python -m http.server 8000
# Or use live-server
npx live-server
```

### Backend Testing
```bash
cd backend
npm run dev
# Test API endpoints
curl http://localhost:3000/api/health
```

### Full Stack Testing
```bash
# Start backend
cd backend && npm start

# Start frontend (in new terminal)
cd frontend && python -m http.server 8000

# Test complete flow
# 1. Open http://localhost:8000
# 2. Add items to cart
# 3. Place order
# 4. Check backend logs
```

## 🔍 Debugging

### Common Issues
1. **CORS Error**: Check FRONTEND_URL in backend environment
2. **API Not Found**: Verify API_URL in frontend environment
3. **Database Connection**: Check MONGODB_URI format
4. **Build Failures**: Check Node.js version compatibility

### Debug Commands
```bash
# Check Node version
node --version

# Check npm version
npm --version

# Test API connectivity
curl -X GET https://your-backend-url.vercel.app/api/health

# Check frontend build
cd frontend && npm run build
```

## 📊 Monitoring

### Vercel Analytics
- Enable Vercel Analytics in dashboard
- Monitor performance metrics
- Track user interactions

### Error Tracking
- Add Sentry for error tracking
- Monitor API response times
- Track conversion rates

## 🔒 Security

### HTTPS
- Vercel/Netlify provide HTTPS by default
- Update API URLs to use HTTPS
- Enable HSTS headers

### Environment Variables
- Never commit .env files
- Use Vercel/Netlify environment variables
- Rotate secrets regularly

## 📈 Performance Optimization

### Frontend
- Enable compression
- Optimize images
- Use CDN for static assets
- Implement lazy loading

### Backend
- Use connection pooling
- Implement caching
- Optimize database queries
- Use rate limiting

## 🚀 Production Checklist

- [ ] Environment variables configured
- [ ] Database connected
- [ ] HTTPS enabled
- [ ] Error tracking setup
- [ ] Analytics configured
- [ ] Performance monitoring
- [ ] Backup strategy
- [ ] Domain configured
- [ ] SSL certificate valid
- [ ] API rate limiting
- [ ] CORS configured
- [ ] Security headers
- [ ] PWA manifest
- [ ] Service worker
- [ ] Offline functionality

## 📞 Support

### Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)

### Contact
- Email: chandra.shekhar@example.com
- Phone: +91 98765 43210
- WhatsApp: +91 98765 43210

## 🎉 Success!

Your Chandra Dukan app is now live! 

### Next Steps
1. Test all functionality
2. Monitor performance
3. Gather user feedback
4. Iterate and improve
5. Scale as needed

### Features to Add Later
- Real-time notifications
- Advanced analytics
- Multi-language support
- Advanced search
- Recommendation engine
- Loyalty program
- Multi-vendor support
