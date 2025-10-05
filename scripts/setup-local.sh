#!/bin/bash

# Chandra Dukan - Local Setup Script
# चंद्रा दुकान - लोकल सेटअप स्क्रिप्ट

set -e

echo "🏪 Chandra Dukan - Local Setup"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo "Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version must be 18 or higher${NC}"
    echo "Current version: $(node -v)"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) found${NC}"

# Check npm
echo "Checking npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm -v) found${NC}"

# Check MongoDB
echo "Checking MongoDB..."
if ! command -v mongod &> /dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB not found locally${NC}"
    echo "You can use MongoDB Atlas instead"
    echo "Visit: https://cloud.mongodb.com"
else
    echo -e "${GREEN}✅ MongoDB found${NC}"
fi

echo ""
echo "Installing dependencies..."
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi
cd ..

# Install frontend dependencies (if package.json exists)
if [ -f "frontend/package.json" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
    else
        echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
        exit 1
    fi
    cd ..
else
    echo -e "${YELLOW}ℹ️  No frontend package.json found (static files)${NC}"
fi

# Create .env file if not exists
echo ""
echo "Setting up environment variables..."

if [ ! -f "backend/.env" ]; then
    echo "Creating backend/.env file..."
    cat > backend/.env << EOF
# Server Configuration
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/chandra-dukan

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this

# CORS
FRONTEND_URL=http://localhost:8000

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads

# Notifications (Optional)
# TWILIO_ACCOUNT_SID=your-twilio-sid
# TWILIO_AUTH_TOKEN=your-twilio-token
# TWILIO_PHONE_NUMBER=your-twilio-number
EOF
    echo -e "${GREEN}✅ Created backend/.env${NC}"
    echo -e "${YELLOW}⚠️  Please update the values in backend/.env${NC}"
else
    echo -e "${GREEN}✅ backend/.env already exists${NC}"
fi

# Create uploads directory
echo ""
echo "Creating directories..."
mkdir -p backend/uploads/products
mkdir -p backend/uploads/categories
mkdir -p backend/logs
echo -e "${GREEN}✅ Directories created${NC}"

# Create sample data
echo ""
echo "Setting up sample data..."
if [ ! -f "backend/backend/data/products.json" ]; then
    mkdir -p backend/backend/data
    cp frontend/data/products-sample.json backend/backend/data/products.json 2>/dev/null || echo "[]" > backend/backend/data/products.json
    cp frontend/data/categories-sample.json backend/backend/data/categories.json 2>/dev/null || echo "[]" > backend/backend/data/categories.json
    echo "[]" > backend/backend/data/orders.json
    echo -e "${GREEN}✅ Sample data created${NC}"
else
    echo -e "${GREEN}✅ Data files already exist${NC}"
fi

echo ""
echo "================================"
echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
echo "================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Update backend/.env with your configuration"
echo ""
echo "2. Start MongoDB (if using local):"
echo "   sudo systemctl start mongod"
echo ""
echo "3. Start backend server:"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "4. Start frontend server (in new terminal):"
echo "   cd frontend"
echo "   python -m http.server 8000"
echo ""
echo "5. Open browser:"
echo "   http://localhost:8000"
echo ""
echo "6. Access admin panel:"
echo "   http://localhost:8000/admin/"
echo ""
echo "================================"
echo "Happy coding! 🚀"
echo "================================"
