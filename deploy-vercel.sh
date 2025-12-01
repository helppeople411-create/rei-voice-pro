#!/bin/bash

echo "🚀 REI Voice Pro - Vercel Deployment Script"
echo "============================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
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

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Set environment variable in Vercel:"
    echo "   vercel env add VITE_GEMINI_API_KEY"
    echo "2. Redeploy to apply environment variable:"
    echo "   vercel --prod"
    echo ""
else
    echo "❌ Deployment failed"
    exit 1
fi
