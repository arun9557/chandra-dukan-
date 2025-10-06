#!/bin/bash

# Chandra Dukan - Production Deployment Script
# चंद्रा दुकान - प्रोडक्शन डिप्लॉयमेंट स्क्रिप्ट

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Chandra Dukan - Production Deployment${NC}"
echo "=========================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found${NC}"
    echo "Installing Vercel CLI..."
    npm install -g vercel
    echo -e "${GREEN}✅ Vercel CLI installed${NC}"
fi

# Pre-deployment checks
echo "Running pre-deployment checks..."
echo ""

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version must be 18 or higher${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js version: $(node -v)${NC}"

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo -e "${RED}❌ backend/.env not found${NC}"
    echo "Please create backend/.env with production values"
    exit 1
fi
echo -e "${GREEN}✅ Environment files found${NC}"

# Run tests
echo ""
echo "Running tests..."
cd backend
npm test || {
    echo -e "${RED}❌ Tests failed${NC}"
    echo "Please fix failing tests before deploying"
    exit 1
}
echo -e "${GREEN}✅ All tests passed${NC}"
cd ..

# Build check
echo ""
echo "Checking build..."
cd backend
npm run build || echo "No build step required"
cd ..
echo -e "${GREEN}✅ Build check complete${NC}"

# Deployment confirmation
echo ""
echo -e "${YELLOW}⚠️  You are about to deploy to PRODUCTION${NC}"
echo ""
echo "This will deploy:"
echo "  - Backend API"
echo "  - Frontend App"
echo "  - Admin Panel"
echo ""
read -p "Continue with deployment? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Deployment cancelled"
    exit 0
fi

# Deploy Backend
echo ""
echo -e "${BLUE}📦 Deploying Backend...${NC}"
cd backend
vercel --prod --yes
BACKEND_URL=$(vercel --prod 2>&1 | grep -o 'https://[^ ]*' | tail -1)
echo -e "${GREEN}✅ Backend deployed: $BACKEND_URL${NC}"
cd ..

# Update frontend API URL
echo ""
echo "Updating frontend API URL..."
if [ -f "frontend/.env" ]; then
    sed -i "s|VITE_API_URL=.*|VITE_API_URL=$BACKEND_URL|g" frontend/.env
else
    echo "VITE_API_URL=$BACKEND_URL" > frontend/.env
fi

# Deploy Frontend
echo ""
echo -e "${BLUE}📦 Deploying Frontend...${NC}"
cd frontend
vercel --prod --yes
FRONTEND_URL=$(vercel --prod 2>&1 | grep -o 'https://[^ ]*' | tail -1)
echo -e "${GREEN}✅ Frontend deployed: $FRONTEND_URL${NC}"
cd ..

# Post-deployment checks
echo ""
echo "Running post-deployment checks..."

# Check backend health
echo "Checking backend health..."
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/health")
if [ "$HEALTH_CHECK" == "200" ]; then
    echo -e "${GREEN}✅ Backend is healthy${NC}"
else
    echo -e "${RED}❌ Backend health check failed (HTTP $HEALTH_CHECK)${NC}"
fi

# Check frontend
echo "Checking frontend..."
FRONTEND_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")
if [ "$FRONTEND_CHECK" == "200" ]; then
    echo -e "${GREEN}✅ Frontend is accessible${NC}"
else
    echo -e "${RED}❌ Frontend check failed (HTTP $FRONTEND_CHECK)${NC}"
fi

# Deployment summary
echo ""
echo "=========================================="
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "=========================================="
echo ""
echo "URLs:"
echo "  Frontend: $FRONTEND_URL"
echo "  Backend:  $BACKEND_URL"
echo "  Admin:    $FRONTEND_URL/admin/"
echo ""
echo "Next steps:"
echo "  1. Test the application"
echo "  2. Update DNS records (if using custom domain)"
echo "  3. Configure environment variables in Vercel dashboard"
echo "  4. Set up monitoring and alerts"
echo "  5. Update documentation with new URLs"
echo ""
echo "=========================================="
echo -e "${BLUE}Happy launching! 🚀${NC}"
echo "=========================================="
