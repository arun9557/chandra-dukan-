# 🚨 URGENT: Login Fix - 5 Minutes

## **Problem:** 
Login nahi ho raha kyunki MongoDB connected nahi hai.

## **Quick Solution:**

### **Option 1: MongoDB Atlas (Recommended - 10 minutes)**

1. **Go to:** https://www.mongodb.com/cloud/atlas/register
2. **Sign up** (free)
3. **Create cluster** (free M0)
4. **Create user:** username: `chandradukan`, password: (save it!)
5. **Whitelist IP:** `0.0.0.0/0`
6. **Get connection string**
7. **Update .env file:**

```bash
cd /home/user/Desktop/chanda-app/backend
nano .env
```

**Replace line 11 with:**
```env
MONGODB_URI=mongodb+srv://chandradukan:YOUR_PASSWORD@cluster.mongodb.net/chandra-dukan?retryWrites=true&w=majority
```

### **Option 2: Local MongoDB (If you have root access)**

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

---

## **After MongoDB Setup:**

```bash
cd /home/user/Desktop/chanda-app/backend

# 1. Test connection
npm run test:db
# Should show: ✅ MongoDB Connection Successful!

# 2. Seed database
npm run seed
# Should show: ✅ Created 2 users, 6 categories, 23 products

# 3. Start backend
npm start
# Should show: 🚀 Backend running on 0.0.0.0:3000
```

---

## **Test Login:**

1. **Open:** http://localhost:8000/login.html
2. **Login with:**
   - Email: `chandra@chandradukan.com`
   - Password: `admin123`
3. **Should redirect to account page**

---

## **If Still Not Working:**

**Check browser console (F12):**
- Should see successful API calls
- No CORS errors
- Token stored in localStorage

**Test API directly:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"chandra@chandradukan.com","password":"admin123"}'
```

---

**MongoDB Atlas setup karo aur login perfect kaam karega! 🚀**

**Detailed guide:** `SETUP_MONGODB_ATLAS.md`
