#!/bin/bash
# APK Testing Script - APK testing script
# Chandra Dukan Mobile App

echo "🧪 Testing Chandra Dukan APK..."

# Check if ADB is available
if ! command -v adb &> /dev/null; then
    echo "❌ ADB not found. Please install Android SDK"
    exit 1
fi

# Check if device is connected
if ! adb devices | grep -q "device$"; then
    echo "❌ No Android device connected. Please connect device and enable USB debugging"
    exit 1
fi

echo "📱 Connected device:"
adb devices

# Install APK (replace with your APK path)
APK_PATH="./chandra-dukan-preview.apk"

if [ ! -f "$APK_PATH" ]; then
    echo "❌ APK file not found at $APK_PATH"
    echo "📥 Please download APK from EAS dashboard first"
    exit 1
fi

echo "📦 Installing APK..."
adb install -r "$APK_PATH"

if [ $? -eq 0 ]; then
    echo "✅ APK installed successfully!"
    
    # Launch app
    echo "🚀 Launching app..."
    adb shell am start -n com.chandrashekhar.chandradudukan/.MainActivity
    
    echo "📱 App launched! Please test the following features:"
    echo "1. ✅ App opens without crashes"
    echo "2. ✅ Navigation works"
    echo "3. ✅ Products load correctly"
    echo "4. ✅ Cart functionality"
    echo "5. ✅ Checkout process"
    echo "6. ✅ Notifications work"
    echo "7. ✅ Location services"
    echo "8. ✅ Offline functionality"
    
    echo "📊 To check logs:"
    echo "adb logcat | grep ChandraDukan"
    
else
    echo "❌ APK installation failed!"
    exit 1
fi

echo "🎉 Testing setup completed!"
