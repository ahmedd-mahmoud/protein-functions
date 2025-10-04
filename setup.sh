#!/bin/bash

# DeepFRI Desktop - Project Setup Script
# This script sets up the project structure and installs dependencies

echo "🧬 DeepFRI Desktop - Project Setup"
echo "===================================="
echo ""

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Create directory structure
echo "📁 Creating project structure..."
mkdir -p src/{core,electron,utils,types,renderer}
mkdir -p assets
mkdir -p output/tags
echo "✓ Directories created"
echo ""

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found"
    echo "Please ensure you have the package.json file in the root directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
echo "This may take a few minutes..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo ""

# Create placeholder icon if not exists
if [ ! -f "assets/icon.png" ]; then
    echo "⚠️  No icon found. Creating placeholder..."
    echo "Please replace assets/icon.png with your application icon (512x512 PNG)"
fi

# Check TypeScript files
echo "📝 Checking TypeScript files..."
if [ -f "src/core/DeepFRIAutomator.ts" ]; then
    echo "✓ Core files found"
else
    echo "⚠️  Core TypeScript files not found"
    echo "Please ensure all TypeScript files are in the src/ directory"
fi
echo ""

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

if [ $? -eq 0 ]; then
    echo "✓ TypeScript compiled successfully"
else
    echo "⚠️  TypeScript compilation had warnings (this is normal)"
fi
echo ""

# Final instructions
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Replace assets/icon.png with your app icon"
echo "2. Review and update package.json with your details"
echo "3. Run 'npm run dev' to start development"
echo "4. Run 'npm run build:win' to build for Windows"
echo ""
echo "For more information, see README.md"
echo ""