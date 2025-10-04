#!/bin/bash
# Chandra Dukan Mobile App Setup Script
# चंद्रा दुकान मोबाइल ऐप सेटअप स्क्रिप्ट

echo "🚀 Setting up Chandra Dukan Mobile App..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found"
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Install Expo CLI globally
echo "📱 Installing Expo CLI..."
npm install -g @expo/cli

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Expo CLI"
    exit 1
fi

echo "✅ Expo CLI installed successfully"

# Install EAS CLI globally
echo "🔧 Installing EAS CLI..."
npm install -g @expo/eas-cli

if [ $? -ne 0 ]; then
    echo "❌ Failed to install EAS CLI"
    exit 1
fi

echo "✅ EAS CLI installed successfully"

# Create assets directory
echo "📁 Creating assets directory..."
mkdir -p assets

# Create placeholder assets
echo "🎨 Creating placeholder assets..."

# Create icon placeholder
cat > assets/icon.png << 'EOF'
# This is a placeholder for the app icon
# Replace with actual 1024x1024 PNG icon
EOF

# Create splash placeholder
cat > assets/splash.png << 'EOF'
# This is a placeholder for the splash screen
# Replace with actual 1242x2436 PNG splash screen
EOF

# Create adaptive icon placeholder
cat > assets/adaptive-icon.png << 'EOF'
# This is a placeholder for the adaptive icon
# Replace with actual 1024x1024 PNG adaptive icon
EOF

echo "✅ Assets directory created"

# Make scripts executable
echo "🔧 Making scripts executable..."
chmod +x scripts/*.sh

echo "✅ Scripts made executable"

# Create .env file
echo "⚙️ Creating environment file..."
cat > .env << 'EOF'
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_APP_NAME=Chandra Dukan
EXPO_PUBLIC_VERSION=1.0.0
EXPO_PUBLIC_ENVIRONMENT=development
EOF

echo "✅ Environment file created"

# Check Android SDK (optional)
if command -v android &> /dev/null; then
    echo "✅ Android SDK found"
else
    echo "⚠️ Android SDK not found. Install Android Studio for Android development"
fi

# Check Xcode (optional)
if command -v xcodebuild &> /dev/null; then
    echo "✅ Xcode found"
else
    echo "⚠️ Xcode not found. Install Xcode for iOS development"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📱 Next steps:"
echo "1. Start development server: npm start"
echo "2. Run on Android: npm run android"
echo "3. Run on iOS: npm run ios"
echo "4. Build APK: ./scripts/build-android.sh"
echo "5. Test APK: ./scripts/test-apk.sh"
echo ""
echo "📚 Documentation: README.md"
echo "🔧 Configuration: app.json, eas.json"
echo "📦 Dependencies: package.json"
echo ""
echo "🚀 Happy coding with Chandra Dukan Mobile App!"
