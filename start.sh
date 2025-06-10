#!/bin/bash

# Exit on error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting BizneAI deployment process...${NC}"

# Function to handle errors
handle_error() {
    echo -e "${RED}Error: $1${NC}"
    exit 1
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required commands
for cmd in node npm pm2 serve; do
    if ! command_exists $cmd; then
        handle_error "$cmd is not installed"
    fi
done

# Ensure we're in the project directory
cd "$(dirname "$0")" || handle_error "Failed to change to project directory"

# Fix permissions
echo -e "${YELLOW}Setting up permissions...${NC}"
sudo chown -R $USER:$USER . || handle_error "Failed to set ownership"
sudo chmod -R 755 . || handle_error "Failed to set permissions"

# Frontend deployment
echo -e "${YELLOW}Deploying frontend...${NC}"
cd frontend || handle_error "Failed to change to frontend directory"

# Clean and create dist directory
echo -e "${YELLOW}Preparing frontend build directory...${NC}"
rm -rf dist || true
mkdir -p dist || handle_error "Failed to create dist directory"
chmod 755 dist || handle_error "Failed to set dist permissions"

# Install dependencies
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
npm install || handle_error "Failed to install frontend dependencies"

# Build the frontend
echo -e "${YELLOW}Building frontend...${NC}"
npm run build || handle_error "Failed to build frontend"

# Backend deployment
echo -e "${YELLOW}Deploying backend...${NC}"
cd ../backend || handle_error "Failed to change to backend directory"

# Install dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
npm install || handle_error "Failed to install backend dependencies"

# Build the backend
echo -e "${YELLOW}Building backend...${NC}"
npm run build || handle_error "Failed to build backend"

# Check if PM2 is running
if ! pm2 ping > /dev/null 2>&1; then
    echo -e "${YELLOW}Starting PM2 daemon...${NC}"
    pm2 start || handle_error "Failed to start PM2 daemon"
fi

# Stop existing instances if running
echo -e "${YELLOW}Stopping existing instances...${NC}"
pm2 stop bizneai-frontend bizneai-backend || true
pm2 delete bizneai-frontend bizneai-backend || true

# Start the backend with PM2
echo -e "${YELLOW}Starting backend with PM2...${NC}"
cd ../backend
pm2 start dist/server.js --name bizneai-backend || handle_error "Failed to start backend"

# Start the frontend with PM2
echo -e "${YELLOW}Starting frontend with PM2...${NC}"
cd ../frontend
pm2 start "serve -s dist -l 3000" --name bizneai-frontend || handle_error "Failed to start frontend"

# Save PM2 process list
echo -e "${YELLOW}Saving PM2 process list...${NC}"
pm2 save || handle_error "Failed to save PM2 process list"

# Setup PM2 to start on system boot
echo -e "${YELLOW}Setting up PM2 startup script...${NC}"
pm2 startup || handle_error "Failed to setup PM2 startup"

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}Backend is running on port 8080${NC}"
echo -e "${GREEN}Frontend is running on port 3000${NC}"
echo -e "${YELLOW}You can check the logs with:${NC}"
echo -e "${YELLOW}  - Backend logs: pm2 logs bizneai-backend${NC}"
echo -e "${YELLOW}  - Frontend logs: pm2 logs bizneai-frontend${NC}" 