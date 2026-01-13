#!/bin/bash

# ShareUpTime - Complete System Startup Script
# Starts Backend (4001), Frontend (3000), and Mobile (Expo)
# Usage: ./start-dev.sh

set -e

echo "🚀 ShareUpTime - Development Environment Startup"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed (needed for backend)"
fi

echo "✅ Prerequisites checked"
echo ""

# Function to start backend
start_backend() {
    echo -e "${BLUE}[Backend]${NC} Starting Express server on port 4001..."
    cd backend
    npm install --silent 2>/dev/null || true
    npm start &
    BACKEND_PID=$!
    cd ..
    sleep 2
    echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
    echo -e "${BLUE}📡 API: http://localhost:4001/api/v1${NC}"
}

# Function to start frontend
start_frontend() {
    echo -e "${BLUE}[Frontend]${NC} Starting React app on port 3000..."
    cd Shareup-frontend
    npm install --silent 2>/dev/null || true
    npm start &
    FRONTEND_PID=$!
    cd ..
    sleep 3
    echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
    echo -e "${BLUE}🌐 Web: http://localhost:3000${NC}"
}

# Function to start mobile
start_mobile() {
    echo -e "${BLUE}[Mobile]${NC} Starting Expo development server..."
    cd mobile-app
    npm install --silent 2>/dev/null || true
    npm start &
    MOBILE_PID=$!
    cd ..
    echo -e "${GREEN}✅ Mobile started (PID: $MOBILE_PID)${NC}"
    echo -e "${BLUE}📱 Expo: Press 'i' for iOS or 'a' for Android${NC}"
}

# Parse arguments
BACKEND=true
FRONTEND=true
MOBILE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --backend-only)
            FRONTEND=false
            MOBILE=false
            shift
            ;;
        --frontend-only)
            BACKEND=false
            MOBILE=false
            shift
            ;;
        --mobile-only)
            BACKEND=false
            FRONTEND=false
            MOBILE=true
            shift
            ;;
        --with-mobile)
            MOBILE=true
            shift
            ;;
        --all)
            MOBILE=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Start services
echo ""
if [ "$BACKEND" = true ]; then
    start_backend
fi

if [ "$FRONTEND" = true ]; then
    start_frontend
fi

if [ "$MOBILE" = true ]; then
    start_mobile
fi

echo ""
echo "=================================================="
echo -e "${GREEN}✅ All services started successfully!${NC}"
echo "=================================================="
echo ""

if [ "$BACKEND" = true ]; then
    echo -e "${BLUE}Backend (Express)${NC}"
    echo "  URL: http://localhost:4001"
    echo "  API: http://localhost:4001/api/v1"
    echo ""
fi

if [ "$FRONTEND" = true ]; then
    echo -e "${BLUE}Frontend (React)${NC}"
    echo "  URL: http://localhost:3000"
    echo ""
fi

if [ "$MOBILE" = true ]; then
    echo -e "${BLUE}Mobile (Expo)${NC}"
    echo "  Press 'i' for iOS simulator"
    echo "  Press 'a' for Android emulator"
    echo "  Scan QR code with Expo Go app"
    echo ""
fi

echo -e "${YELLOW}Press CTRL+C to stop all services${NC}"
echo ""

# Wait for all processes
wait
