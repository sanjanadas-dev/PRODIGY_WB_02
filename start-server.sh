#!/bin/bash
# ShadoW Server Startup - macOS/Linux Script

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║      ShadoW Server Startup Helper (macOS/Linux)        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ ERROR: .env file not found!"
    echo ""
    echo "📝 Please create a .env file with:"
    echo ""
    echo "PORT=3000"
    echo "MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/shadow_saas"
    echo "JWT_SECRET=supersecretkey12345678901234567890"
    echo ""
    echo "📌 Copy .env.example to .env as a template"
    echo ""
    exit 1
fi

echo "✅ .env file found"
echo ""
echo "📋 Prerequisites Check:"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  Dependencies not installed!"
    echo "Installing npm packages..."
    echo ""
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ NPM install failed!"
        exit 1
    fi
    echo "✅ Dependencies installed"
    echo ""
else
    echo "✅ Dependencies installed"
    echo ""
fi

echo "╔════════════════════════════════════════════════════════╗"
echo "║      Starting ShadoW Express Server...                 ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Start the server
node server.js

# If server exits
echo ""
echo "🛑 Server stopped or encountered an error"
echo ""
