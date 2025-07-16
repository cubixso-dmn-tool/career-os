#!/bin/bash
echo "Building CareerOS for Vercel deployment..."

# Install dependencies
npm install

# Build frontend
echo "Building frontend..."
vite build

# Build backend
echo "Building backend..."
esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Build completed successfully!"