#!/bin/bash

# Deploy script for Adminka app
set -e

# Configuration
APP_NAME="adminka"
IMAGE_NAME="station2290-adminka"
CONTAINER_NAME="adminka-app"
PORT="80"
API_URL="${API_URL:-http://api.station2290.ru}"

echo "🚀 Deploying $APP_NAME..."

# Stop and remove existing container
echo "⏹️ Stopping existing container..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# Remove old image
echo "🗑️ Removing old image..."
docker rmi $IMAGE_NAME 2>/dev/null || true

# Build new image
echo "🔨 Building new image..."
docker build -t $IMAGE_NAME .

# Run new container
echo "🏃 Starting new container..."
docker run -d \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  -p $PORT:80 \
  -e VITE_API_URL=$API_URL \
  $IMAGE_NAME

# Wait for container to be ready
echo "⏳ Waiting for container to be ready..."
sleep 10

# Check if container is running
if docker ps | grep -q $CONTAINER_NAME; then
  echo "✅ $APP_NAME deployed successfully!"
  echo "🌐 Available at: http://localhost:$PORT"
  echo "📊 Container status:"
  docker ps | grep $CONTAINER_NAME
else
  echo "❌ Deployment failed!"
  echo "📋 Container logs:"
  docker logs $CONTAINER_NAME
  exit 1
fi

# Show logs
echo "📋 Recent logs:"
docker logs --tail 20 $CONTAINER_NAME