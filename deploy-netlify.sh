#!/bin/bash

echo "🚀 REI Voice Pro - Netlify Deployment Script"
echo "============================================="
echo ""

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  Warning: .env.local not found"
    echo "Please create .env.local with your VITE_GEMINI_API_KEY"
    exit 1
fi

# Read API key from .env.local
API_KEY=$(grep VITE_GEMINI_API_KEY .env.local | cut -d '=' -f2)

if [ "$API_KEY" == "PLACEHOLDER_API_KEY" ] || [ -z "$API_KEY" ]; then
    echo "❌ Error: Please set a valid VITE_GEMINI_API_KEY in .env.local"
    exit 1
fi

echo "✅ API key found"
echo ""

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

echo "✅ Build successful"
echo ""

# Set environment variable
echo "🔐 Setting environment variable..."
netlify env:set VITE_GEMINI_API_KEY "$API_KEY"

# Deploy to Netlify
echo "🚀 Deploying to Netlify..."
netlify deploy --prod --dir=dist

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "🎉 Your app is now live!"
    echo ""
else
    echo "❌ Deployment failed"
    exit 1
fi
