#!/bin/bash

# Code Visualization Agent - Setup Script
echo "🚀 Setting up Code Visualization Agent..."

# Check Node.js version
node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 18 ]; then
    echo "❌ Node.js 18.x or 20.x is required. Current version: $(node --version)"
    exit 1
fi
echo "✅ Node.js version check passed: $(node --version)"

# Check if Forge CLI is installed
if ! command -v forge &> /dev/null; then
    echo "📦 Installing Forge CLI globally..."
    npm install -g @forge/cli
else
    echo "✅ Forge CLI is already installed"
fi

# Install project dependencies
echo "📦 Installing project dependencies..."
npm install --ignore-scripts

# Check if user is logged into Forge
echo "🔐 Checking Forge authentication..."
if ! forge whoami &> /dev/null; then
    echo "⚠️  Please login to Forge:"
    echo "   forge login"
    echo ""
else
    echo "✅ Forge authentication verified"
fi

# Create environment file if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "📝 Created .env file from template"
    echo "⚠️  Don't forget to set your GEMINI_API_KEY:"
    echo "   forge environment set GEMINI_API_KEY your_api_key_here"
    echo ""
fi

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set your Gemini API key (optional):"
echo "   forge environment set GEMINI_API_KEY your_api_key_here"
echo ""
echo "2. Deploy the app:"
echo "   forge deploy"
echo ""
echo "3. Install on your Jira site:"
echo "   forge install"
echo ""
echo "4. Start development tunnel:"
echo "   npm start"
echo ""
echo "📚 Check README.md for detailed instructions!"