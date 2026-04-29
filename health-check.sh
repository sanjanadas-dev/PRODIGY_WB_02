#!/bin/bash
# Quick Health Check for ShadoW
# Run this to verify everything is set up correctly

echo "🏥 ShadoW Health Check"
echo "===================="
echo ""

# Check .env exists
if [ -f ".env" ]; then
  echo "✅ .env file exists"
else
  echo "❌ .env file missing"
  exit 1
fi

# Check node_modules
if [ -d "node_modules" ]; then
  echo "✅ Dependencies installed"
else
  echo "❌ Dependencies not installed (run: npm install)"
  exit 1
fi

# Check .env values
if grep -q "PORT=" .env; then
  PORT=$(grep "PORT=" .env | cut -d'=' -f2)
  echo "✅ PORT configured: $PORT"
else
  echo "❌ PORT not in .env"
fi

if grep -q "JWT_SECRET=" .env; then
  echo "✅ JWT_SECRET configured"
else
  echo "❌ JWT_SECRET not in .env"
fi

if grep -q "MONGODB_URI=" .env; then
  echo "✅ MONGODB_URI configured"
else
  echo "⚠️  MONGODB_URI not configured (in-memory mode)"
fi

echo ""
echo "✅ System ready! Run: npm start"
