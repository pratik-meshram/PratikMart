#!/bin/bash

echo "🚀 PratikMart Installation Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   Run: mongod"
    exit 1
fi

echo "✅ MongoDB is running"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed"
    exit 1
fi
echo "✅ Backend dependencies installed"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed"
    exit 1
fi
echo "✅ Frontend dependencies installed"
echo ""

# Seed database
echo "🌱 Seeding database..."
cd ../backend
node seed.js
if [ $? -ne 0 ]; then
    echo "❌ Database seeding failed"
    exit 1
fi
echo "✅ Database seeded successfully"
echo ""

echo "🎉 Installation Complete!"
echo ""
echo "📝 Next Steps:"
echo "   1. Start backend:  cd backend && npm run dev"
echo "   2. Start frontend: cd frontend && npm run dev"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3000"
echo "   Admin:    http://localhost:5173/admin"
echo ""
echo "🔑 Admin Credentials:"
echo "   Email:    admin@shop.com"
echo "   Password: admin123"
echo ""
echo "💳 Test Payment (Razorpay):"
echo "   Card:     4111 1111 1111 1111"
echo "   UPI:      success@razorpay"
echo ""
echo "Happy selling! 🛍️"
