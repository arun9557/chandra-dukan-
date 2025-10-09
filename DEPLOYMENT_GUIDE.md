# 🚀 Chandra Dukan - Complete Deployment Guide

## **Step-by-Step Guide for Vercel Deployment**

---

## 📋 **Pre-Deployment Checklist:**

- [ ] MongoDB Atlas account created
- [ ] Vercel account created
- [ ] GitHub repository pushed
- [ ] Email service credentials ready (optional)
- [ ] Twilio credentials ready (optional)
- [ ] Payment gateway keys ready (test mode)

---

## 🎯 **Deployment Strategy:**

You need **2 separate Vercel projects**:
1. **Frontend** - Static HTML/JS/CSS files
2. **Backend API** - Node.js Express server

---

## 📦 **STEP 1: Setup MongoDB Atlas (Database)**

### **1.1 Create Account:**
```
1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up (free tier)
3. Create organization: "Chandra Dukan"
```

### **1.2 Create Cluster:**
```
1. Click "Build a Database"
2. Choose: FREE (M0 Sandbox)
3. Provider: AWS
4. Region: Mumbai (ap-south-1) - closest to India
5. Cluster Name: "chandra-dukan"
6. Click "Create"
```

### **1.3 Create Database User:**
```
1. Security → Database Access
2. Add New Database User
3. Username: chandradukan
4. Password: Generate Secure Password (SAVE THIS!)
5. Database User Privileges: Read and write to any database
6. Add User
```

### **1.4 Whitelist IP (Allow from Anywhere):**
```
1. Security → Network Access
2. Add IP Address
3. Click "Allow Access from Anywhere"
4. IP: 0.0.0.0/0
5. Confirm
```

### **1.5 Get Connection String:**
```
1. Database → Connect
2. Choose: "Connect your application"
3. Driver: Node.js
4. Copy connection string
5. Replace <password> with your actual password
6. Replace <dbname> with: chandra-dukan

Final format:
mongodb+srv://chandradukan:YOUR_PASSWORD@chandra-dukan.xxxxx.mongodb.net/chandra-dukan?retryWrites=true&w=majority
```

**✅ MongoDB Setup Complete!**

---

## 🎨 **STEP 2: Deploy Frontend to Vercel**

### **2.1 Create vercel.json in frontend folder:**

Go to your project and create this file:

```bash
cd /home/user/Desktop/chanda-app/frontend
```

Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "*.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### **2.2 Deploy Frontend:**

**Option A: Via Vercel Dashboard**
```
1. Go to: https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repo: arun9557/chandra-dukan-
4. Project Name: chandra-dukan-frontend
5. Root Directory: frontend
6. Framework Preset: Other
7. Build Command: (leave empty)
8. Output Directory: ./
9. Click "Deploy"
```

**Option B: Via Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy frontend
cd frontend
vercel --prod
```

**✅ Frontend Deployed!**
Your frontend URL: `https://chandra-dukan-frontend.vercel.app`

---

## ⚙️ **STEP 3: Deploy Backend API to Vercel**

### **3.1 Create vercel.json in backend folder:**

```bash
cd /home/user/Desktop/chanda-app/backend
```

Create `vercel.json`:
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
      "dest": "/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### **3.2 Update package.json:**

Make sure your `backend/package.json` has:
```json
{
  "name": "chandra-dukan-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": "18.x"
  }
}
```

### **3.3 Deploy Backend:**

**Via Vercel Dashboard:**
```
1. Go to Vercel Dashboard
2. Click "Add New" → "Project"
3. Import same GitHub repo
4. Project Name: chandra-dukan-api
5. Root Directory: backend
6. Framework Preset: Other
7. Build Command: npm install
8. Output Directory: ./
9. Click "Deploy" (Don't click yet! First add environment variables below)
```

### **3.4 Add Environment Variables:**

Before deploying, add these in Vercel dashboard:

```
Key: MONGODB_URI
Value: mongodb+srv://chandradukan:YOUR_PASSWORD@...

Key: JWT_SECRET
Value: your-super-secret-jwt-key-change-this-12345

Key: JWT_EXPIRE
Value: 7d

Key: FRONTEND_URL
Value: https://chandra-dukan-frontend.vercel.app

Key: NODE_ENV
Value: production

Key: PORT
Value: 3000

# Email (Optional - configure later)
Key: SMTP_HOST
Value: smtp.gmail.com

Key: SMTP_PORT
Value: 587

Key: SMTP_USER
Value: your-email@gmail.com

Key: SMTP_PASS
Value: your-app-password

Key: SMTP_FROM_NAME
Value: Chandra Dukan

# SMS (Optional - configure later)
Key: TWILIO_ACCOUNT_SID
Value: your-twilio-sid

Key: TWILIO_AUTH_TOKEN
Value: your-twilio-token

Key: TWILIO_PHONE_NUMBER
Value: +1234567890

# Admin
Key: ADMIN_EMAIL
Value: admin@chandradukan.com

Key: ADMIN_PHONE
Value: +917465073957

# Payment (Test Mode)
Key: RAZORPAY_KEY_ID
Value: your-razorpay-test-key

Key: RAZORPAY_KEY_SECRET
Value: your-razorpay-test-secret
```

Now click **"Deploy"**!

**✅ Backend API Deployed!**
Your API URL: `https://chandra-dukan-api.vercel.app`

---

## 🔗 **STEP 4: Connect Frontend to Backend**

### **4.1 Update Frontend API URLs:**

In all your frontend JavaScript files, update API base URL:

**Find and replace in all .js files:**
```javascript
// OLD:
const baseUrl = 'http://localhost:3000/api'

// NEW:
const baseUrl = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api'
  : 'https://chandra-dukan-api.vercel.app/api'
```

### **4.2 Update CORS in Backend:**

Your `backend/server.js` should have:
```javascript
app.use(cors({
  origin: [
    'http://localhost:8000',
    'https://chandra-dukan-frontend.vercel.app'
  ],
  credentials: true
}));
```

### **4.3 Commit and Push:**
```bash
git add .
git commit -m "Updated API URLs for production"
git push origin main
```

Vercel will auto-deploy the changes!

---

## ☁️ **STEP 5: Setup Cloud Storage (for File Uploads)**

**⚠️ Important:** Vercel doesn't support file system writes. Use Cloudinary:

### **5.1 Create Cloudinary Account:**
```
1. Go to: https://cloudinary.com
2. Sign up (free tier)
3. Get: Cloud Name, API Key, API Secret
```

### **5.2 Install Cloudinary:**
```bash
cd backend
npm install cloudinary multer-storage-cloudinary
```

### **5.3 Add to Environment Variables in Vercel:**
```
Key: CLOUDINARY_CLOUD_NAME
Value: your-cloud-name

Key: CLOUDINARY_API_KEY
Value: your-api-key

Key: CLOUDINARY_API_SECRET
Value: your-api-secret
```

### **5.4 Update File Upload Code:**
You'll need to modify upload middleware to use Cloudinary instead of local storage.

---

## ✅ **STEP 6: Test Your Deployment**

### **6.1 Test Frontend:**
```
Visit: https://chandra-dukan-frontend.vercel.app
- Homepage loads? ✅
- Products page works? ✅
- Images loading? ✅
- Navigation working? ✅
```

### **6.2 Test Backend API:**
```
Visit: https://chandra-dukan-api.vercel.app/api/health

Should return:
{
  "status": "OK",
  "timestamp": "...",
  "uptime": 123
}
```

### **6.3 Test Full Flow:**
```
1. Register new user ✅
2. Login ✅
3. Browse products ✅
4. Add to cart ✅
5. Place order ✅
6. Check order history ✅
```

---

## 🔧 **Common Issues & Fixes:**

### **Issue 1: CORS Error**
```
Error: Access-Control-Allow-Origin

Fix:
1. Go to Vercel → Backend project → Settings → Environment Variables
2. Update FRONTEND_URL to your actual frontend URL
3. Redeploy
```

### **Issue 2: Database Connection Failed**
```
Error: MongoNetworkError

Fix:
1. Check MongoDB Atlas → Network Access
2. Ensure 0.0.0.0/0 is whitelisted
3. Verify MONGODB_URI in Vercel env variables
4. Check username/password in connection string
```

### **Issue 3: File Upload Fails**
```
Error: EROFS: read-only file system

Fix:
This is expected on Vercel. You MUST use Cloudinary for uploads.
Follow Step 5 above.
```

### **Issue 4: Environment Variables Not Working**
```
Error: process.env.MONGODB_URI is undefined

Fix:
1. Vercel → Project → Settings → Environment Variables
2. Make sure all variables are added
3. Click "Redeploy" (not just deploy)
```

---

## 🎯 **Production Checklist:**

### **Before Going Live:**
- [ ] MongoDB Atlas configured
- [ ] All environment variables set
- [ ] CORS configured correctly
- [ ] Frontend → Backend URLs updated
- [ ] File uploads migrated to Cloudinary
- [ ] Test user registration
- [ ] Test login/logout
- [ ] Test product browsing
- [ ] Test cart functionality
- [ ] Test order placement
- [ ] Test payment (test mode)
- [ ] Test email notifications
- [ ] Test SMS notifications (optional)
- [ ] SSL/HTTPS working (Vercel provides free)
- [ ] Custom domain configured (optional)

---

## 🌐 **Optional: Add Custom Domain**

### **For Frontend:**
```
1. Vercel → Frontend Project → Settings → Domains
2. Add Domain: chandradukan.com
3. Follow DNS instructions from your domain provider
4. Wait for DNS propagation (10-60 minutes)
```

### **For Backend:**
```
1. Vercel → Backend Project → Settings → Domains
2. Add Domain: api.chandradukan.com
3. Update DNS with CNAME record
4. Update FRONTEND_URL in frontend code
```

---

## 📊 **Monitoring Your App:**

### **Vercel Dashboard:**
```
1. Analytics → See visitor stats
2. Logs → Debug errors
3. Deployments → View history
4. Functions → Monitor API performance
```

### **MongoDB Atlas:**
```
1. Metrics → Database performance
2. Real-time → Active connections
3. Alerts → Setup email alerts
```

---

## 💰 **Costs Overview:**

```
Vercel (Hobby Plan):          FREE
  - Unlimited deployments
  - 100 GB bandwidth/month
  - Automatic SSL
  - Custom domains

MongoDB Atlas (Free Tier):    FREE
  - 512 MB storage
  - Shared RAM
  - Good for small projects

Cloudinary (Free Tier):       FREE
  - 25 GB storage
  - 25 GB bandwidth/month

Optional:
Domain Name:                   ₹500-1000/year
Twilio SMS:                    Pay-as-you-go
Email Service:                 FREE (Gmail)

Total for Basic Setup:         ₹0/month
```

---

## 🚀 **Quick Deployment Commands:**

```bash
# Deploy Frontend
cd frontend
vercel --prod

# Deploy Backend
cd backend
vercel --prod

# Check Deployment
vercel ls

# View Logs
vercel logs

# Remove Deployment
vercel rm project-name
```

---

## 📝 **Post-Deployment Tasks:**

### **Week 1:**
1. Monitor for errors
2. Test all features
3. Get user feedback
4. Fix critical bugs

### **Week 2:**
5. Add missing features
6. Optimize performance
7. Improve UI/UX
8. Add analytics

### **Week 3:**
9. Marketing/promotion
10. Gather reviews
11. Scale if needed
12. Plan v2 features

---

## 🆘 **Need Help?**

### **Vercel Documentation:**
- https://vercel.com/docs

### **MongoDB Atlas Docs:**
- https://docs.atlas.mongodb.com

### **Cloudinary Docs:**
- https://cloudinary.com/documentation

### **Common Commands:**
```bash
# Redeploy
vercel --prod

# View logs
vercel logs --follow

# Check environment
vercel env ls

# Add environment variable
vercel env add

# Pull latest
vercel pull
```

---

## ✅ **You're Ready to Deploy!**

Follow these steps in order:
1. ✅ Setup MongoDB Atlas
2. ✅ Deploy Frontend to Vercel
3. ✅ Deploy Backend to Vercel
4. ✅ Connect them together
5. ✅ Setup Cloudinary
6. ✅ Test everything
7. ✅ Go Live! 🎉

**Questions? Check the troubleshooting section above!**

---

**Made with ❤️ for Chandra Dukan**
*आपके घर तक, जल्दी और आसान* 🏪

**Status: 🟢 READY TO DEPLOY**
