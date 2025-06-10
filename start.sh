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
for cmd in node npm pm2; do
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

# Clean and create dist directory
echo -e "${YELLOW}Preparing build directory...${NC}"
rm -rf dist || true
mkdir -p dist || handle_error "Failed to create dist directory"
chmod 755 dist || handle_error "Failed to set dist permissions"

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install || handle_error "Failed to install dependencies"

# Build the application
echo -e "${YELLOW}Building the application...${NC}"
npm run build || handle_error "Failed to build application"

# Check if PM2 is running
if ! pm2 ping > /dev/null 2>&1; then
    echo -e "${YELLOW}Starting PM2 daemon...${NC}"
    pm2 start || handle_error "Failed to start PM2 daemon"
fi

# Stop existing instance if running
echo -e "${YELLOW}Stopping existing instance...${NC}"
pm2 stop bizneai-api || true
pm2 delete bizneai-api || true

# Start the application with PM2
echo -e "${YELLOW}Starting application with PM2...${NC}"
pm2 start ecosystem.config.js --env production || handle_error "Failed to start application"

# Save PM2 process list
echo -e "${YELLOW}Saving PM2 process list...${NC}"
pm2 save || handle_error "Failed to save PM2 process list"

# Setup PM2 to start on system boot
echo -e "${YELLOW}Setting up PM2 startup script...${NC}"
pm2 startup || handle_error "Failed to setup PM2 startup"

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}Application is running on port 8080${NC}"
echo -e "${YELLOW}You can check the logs with: pm2 logs bizneai-api${NC}" 