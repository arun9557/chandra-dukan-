# ✅ Deployment Checklist - Chandra Dukan
# चंद्रा दुकान - डिप्लॉयमेंट चेकलिस्ट

Complete checklist for deploying Chandra Dukan to production.

---

## 📋 Pre-Deployment Checklist

### 🔧 Local Testing
- [ ] All backend tests passing (`npm test`)
- [ ] Frontend loads without errors
- [ ] Complete user flow tested (browse → cart → checkout → order)
- [ ] Admin panel functional
- [ ] Mobile responsive design verified
- [ ] Cross-browser testing completed
- [ ] Performance acceptable (Lighthouse score > 80)

### 📝 Code Quality
- [ ] No console.log statements in production code
- [ ] Error handling implemented
- [ ] Input validation added
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Code reviewed and cleaned

### 🗄️ Database
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with proper permissions
- [ ] Network access configured (IP whitelist)
- [ ] Connection string obtained
- [ ] Sample data imported (optional)
- [ ] Indexes created for performance

### 🔐 Environment Variables
- [ ] Backend `.env` configured with production values
- [ ] Frontend API URL updated
- [ ] JWT secret generated (strong, random)
- [ ] Database connection string added
- [ ] Third-party API keys added (Twilio, etc.)
- [ ] All sensitive data removed from code

### 📦 Dependencies
- [ ] All dependencies installed
- [ ] No vulnerable packages (`npm audit`)
- [ ] Unused dependencies removed
- [ ] Package versions locked

---

## 🚀 Deployment Steps

### Step 1: Setup Accounts

#### Vercel Account
- [ ] Create account at [vercel.com](https://vercel.com)
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Login: `vercel login`
- [ ] Connect GitHub repository

#### MongoDB Atlas
- [ ] Create account at [cloud.mongodb.com](https://cloud.mongodb.com)
- [ ] Create cluster (Free tier available)
- [ ] Create database user
- [ ] Whitelist IP addresses (0.0.0.0/0 for Vercel)
- [ ] Get connection string

### Step 2: Deploy Backend

```bash
cd backend

# Deploy to Vercel
vercel --prod

# Note the deployment URL
# Example: https://chandra-dukan-backend.vercel.app
```

**Configure Environment Variables in Vercel:**
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add the following:

```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chandra-dukan
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
FRONTEND_URL=https://your-frontend-url.vercel.app
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

Optional (for notifications):
```
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-number
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

- [ ] Backend deployed successfully
- [ ] Environment variables configured
- [ ] Health check endpoint working: `/api/health`

### Step 3: Deploy Frontend

```bash
cd frontend

# Update API URL in code if needed
# Then deploy
vercel --prod

# Note the deployment URL
# Example: https://chandra-dukan.vercel.app
```

**Configure Environment Variables in Vercel:**
```
VITE_API_URL=https://chandra-dukan-backend.vercel.app
VITE_APP_NAME=Chandra Dukan
VITE_APP_VERSION=1.0.0
```

- [ ] Frontend deployed successfully
- [ ] Can access homepage
- [ ] Can access admin panel: `/admin/`

### Step 4: Update CORS

Update backend CORS to allow frontend domain:

In `backend/server.js`, update CORS configuration:
```javascript
const corsOptions = {
  origin: [
    'https://chandra-dukan.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
};
```

Redeploy backend:
```bash
cd backend
vercel --prod
```

- [ ] CORS updated with production URLs
- [ ] Backend redeployed

---

## 🧪 Post-Deployment Testing

### Backend API Testing

```bash
# Set your backend URL
BACKEND_URL="https://chandra-dukan-backend.vercel.app"

# Test health endpoint
curl $BACKEND_URL/api/health

# Test products endpoint
curl $BACKEND_URL/api/products

# Test categories endpoint
curl $BACKEND_URL/api/categories
```

- [ ] Health check returns `{"status":"ok"}`
- [ ] Products API returns data
- [ ] Categories API returns data
- [ ] Orders API accessible
- [ ] Response time < 1 second

### Frontend Testing

Open your frontend URL and test:

- [ ] Homepage loads correctly
- [ ] Products display with images
- [ ] Search functionality works
- [ ] Category filtering works
- [ ] Add to cart works
- [ ] Cart modal opens and functions
- [ ] Checkout process completes
- [ ] Order confirmation displays
- [ ] Admin panel accessible
- [ ] Dashboard shows data
- [ ] Order management works

### Integration Testing

Complete end-to-end flow:

1. [ ] Browse products
2. [ ] Add 3-5 items to cart
3. [ ] Update quantities
4. [ ] Proceed to checkout
5. [ ] Fill customer details
6. [ ] Select payment method
7. [ ] Place order
8. [ ] Verify order in admin panel
9. [ ] Update order status
10. [ ] Verify in database

### Mobile Testing

- [ ] Test on mobile device (iOS/Android)
- [ ] Responsive design works
- [ ] Touch interactions smooth
- [ ] Forms easy to fill
- [ ] PWA installable

### Performance Testing

```bash
# Run Lighthouse
lighthouse https://your-frontend-url.vercel.app --view

# Check scores:
# Performance: > 80
# Accessibility: > 90
# Best Practices: > 90
# SEO: > 90
# PWA: > 80
```

- [ ] Performance score > 80
- [ ] Accessibility score > 90
- [ ] Best Practices score > 90
- [ ] SEO score > 90
- [ ] PWA score > 80

---

## 🔒 Security Checklist

- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Security headers configured
- [ ] CORS properly restricted
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Sensitive data encrypted
- [ ] API keys secured
- [ ] No secrets in code
- [ ] Authentication working
- [ ] Authorization working

---

## 📊 Monitoring Setup

### Vercel Analytics
- [ ] Enable Vercel Analytics in dashboard
- [ ] Monitor page views
- [ ] Track performance metrics

### Error Tracking (Optional)
- [ ] Setup Sentry or similar
- [ ] Configure error alerts
- [ ] Test error reporting

### Uptime Monitoring (Optional)
- [ ] Setup UptimeRobot or similar
- [ ] Monitor backend API
- [ ] Monitor frontend
- [ ] Configure alerts

---

## 🌐 Custom Domain (Optional)

### Setup Custom Domain

1. **Purchase Domain**
   - [ ] Buy domain from provider (Namecheap, GoDaddy, etc.)

2. **Configure in Vercel**
   - [ ] Go to Project → Settings → Domains
   - [ ] Add custom domain
   - [ ] Follow DNS configuration instructions

3. **Update DNS Records**
   - [ ] Add A record or CNAME as instructed
   - [ ] Wait for DNS propagation (up to 48 hours)

4. **Update Environment Variables**
   - [ ] Update FRONTEND_URL in backend
   - [ ] Update CORS configuration
   - [ ] Redeploy both frontend and backend

5. **SSL Certificate**
   - [ ] Vercel automatically provisions SSL
   - [ ] Verify HTTPS working

---

## 📱 Mobile App Deployment (Optional)

### Android (Google Play)
- [ ] Build APK: `cd mobile && npm run build:android`
- [ ] Test APK on device
- [ ] Create Google Play Developer account
- [ ] Prepare store listing
- [ ] Upload APK
- [ ] Submit for review

### iOS (App Store)
- [ ] Build IPA: `cd mobile && npm run build:ios`
- [ ] Test on device
- [ ] Create Apple Developer account
- [ ] Prepare store listing
- [ ] Upload to App Store Connect
- [ ] Submit for review

---

## 📝 Documentation Updates

- [ ] Update README.md with production URLs
- [ ] Update API documentation
- [ ] Create user guide
- [ ] Create admin guide
- [ ] Document deployment process
- [ ] Add troubleshooting guide

---

## 🎯 Go-Live Checklist

### Final Checks
- [ ] All tests passing
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] Documentation complete

### Communication
- [ ] Notify team of deployment
- [ ] Share production URLs
- [ ] Provide admin credentials
- [ ] Schedule training session (if needed)

### Launch
- [ ] Deploy to production
- [ ] Verify all functionality
- [ ] Monitor for errors
- [ ] Be ready for quick fixes

---

## 🔄 Post-Launch

### Day 1
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify all features working
- [ ] Respond to user feedback
- [ ] Fix critical issues immediately

### Week 1
- [ ] Analyze usage patterns
- [ ] Gather user feedback
- [ ] Identify improvements
- [ ] Plan updates
- [ ] Optimize performance

### Month 1
- [ ] Review analytics
- [ ] Assess user satisfaction
- [ ] Plan new features
- [ ] Optimize costs
- [ ] Scale if needed

---

## 🆘 Rollback Plan

If something goes wrong:

1. **Immediate Rollback**
   ```bash
   # In Vercel dashboard
   # Go to Deployments → Previous deployment → Promote to Production
   ```

2. **Fix Issues**
   - Identify problem
   - Fix in local environment
   - Test thoroughly
   - Redeploy

3. **Communication**
   - Notify users of issue
   - Provide ETA for fix
   - Update status page

---

## 📞 Support Contacts

### Technical Support
- **Vercel:** support@vercel.com
- **MongoDB:** support@mongodb.com
- **GitHub:** support@github.com

### Emergency Contacts
- **Developer:** your-email@example.com
- **Phone:** +91 98765 43210

---

## ✅ Final Sign-Off

Deployment completed by: _______________

Date: _______________

Verified by: _______________

Production URLs:
- Frontend: _______________
- Backend: _______________
- Admin: _______________

Notes:
_______________________________________________
_______________________________________________
_______________________________________________

---

**Congratulations! Your app is now live! 🎉**

*सफलता की शुभकामनाएं - Best wishes for success*
