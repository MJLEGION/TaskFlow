#!/bin/bash

# TaskFlow Staging Deployment Script
set -e

echo "🚀 Starting TaskFlow Staging Deployment..."

# Configuration
ENVIRONMENT="staging"
IMAGE_TAG="develop"
REGISTRY="ghcr.io"
REPO_NAME="taskflow/taskflow"

echo "📋 Deployment Configuration:"
echo "  Environment: $ENVIRONMENT"
echo "  Image Tag: $IMAGE_TAG"
echo "  Registry: $REGISTRY"
echo "  Repository: $REPO_NAME"

# Health check function
health_check() {
    local url=$1
    local max_attempts=30
    local attempt=1
    
    echo "🏥 Performing health check on $url..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$url/health" > /dev/null; then
            echo "✅ Health check passed!"
            return 0
        fi
        
        echo "⏳ Attempt $attempt/$max_attempts failed, retrying in 10s..."
        sleep 10
        attempt=$((attempt + 1))
    done
    
    echo "❌ Health check failed after $max_attempts attempts"
    return 1
}

# Deploy to staging
echo "🎯 Deploying to staging environment..."

# Simulate deployment commands (replace with actual deployment logic)
echo "📦 Pulling image: $REGISTRY/$REPO_NAME:$IMAGE_TAG"
# docker pull $REGISTRY/$REPO_NAME:$IMAGE_TAG

echo "🔄 Updating staging deployment..."
# kubectl set image deployment/taskflow-staging taskflow=$REGISTRY/$REPO_NAME:$IMAGE_TAG
# or
# docker-compose -f docker-compose.staging.yml up -d

echo "⏳ Waiting for deployment to stabilize..."
sleep 30

# Health check
STAGING_URL="https://taskflow-staging.herokuapp.com"
if health_check "$STAGING_URL"; then
    echo "🎉 Staging deployment successful!"
    echo "🌐 Staging URL: $STAGING_URL"
    
    # Run smoke tests
    echo "🧪 Running staging smoke tests..."
    # npm run test:staging
    
    echo "✅ Staging deployment completed successfully!"
else
    echo "❌ Staging deployment failed health check"
    exit 1
fi