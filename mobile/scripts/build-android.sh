#!/bin/bash
# Android Build Script - Android build script
# Chandra Dukan Mobile App

echo "🚀 Building Chandra Dukan Android APK..."

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found. Installing..."
    npm install -g @expo/eas-cli
fi

# Check if logged in to Expo
if ! eas whoami &> /dev/null; then
    echo "❌ Not logged in to Expo. Please login..."
    eas login
fi

# Build APK
echo "📱 Building APK..."
eas build --platform android --profile preview --non-interactive

# Check build status
if [ $? -eq 0 ]; then
    echo "✅ APK build completed successfully!"
    echo "📥 Download APK from: https://expo.dev/accounts/[your-account]/projects/chandra-dukan/builds"
    echo "📱 Install APK on Android device to test"
else
    echo "❌ APK build failed!"
    exit 1
fi

echo "🎉 Build process completed!"
