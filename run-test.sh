#!/bin/bash

echo "================================"
echo "JobScan Lite - Quick Test Setup"
echo "================================"
echo ""

# Backup original
if [ ! -f "manifest-original.json" ]; then
  echo "📋 Backing up original manifest..."
  cp manifest.json manifest-original.json
fi

# Use test manifest
echo "🔄 Switching to test manifest..."
cp manifest-test.json manifest.json

echo ""
echo "✅ Test setup complete!"
echo ""
echo "Next steps:"
echo "1. Go to chrome://extensions/"
echo "2. Find 'JobScan Lite — TEST VERSION'"
echo "3. Click the RELOAD button 🔄"
echo "4. Click the extension icon"
echo "5. Right-click → Inspect → Console tab"
echo "6. Look for: === SIMPLE SETUP COMPLETE ==="
echo "7. Click buttons and move slider"
echo ""
echo "To restore original:"
echo "  cp manifest-original.json manifest.json"
echo "  (then reload extension)"
echo ""
