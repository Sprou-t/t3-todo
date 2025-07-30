#!/bin/bash

# Development script for auto-rebuilding Docker containers

echo "🚀 Starting T3 Todo with auto-rebuild..."

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start with auto-rebuild
echo "🔨 Building and starting containers..."
docker-compose up --build

# To stop: Ctrl+C
echo "✅ Use Ctrl+C to stop the containers" 