#!/bin/bash

echo "================================"
echo "Switching to FULL VERSION"
echo "================================"
echo ""

# Backup current
if [ ! -f "manifest-backup.json" ]; then
  cp manifest.json manifest-backup.json
fi

# Use full version
cp manifest-full-fixed.json manifest.json

echo "✅ Switched to full version with fixed code!"
echo ""
echo "Next steps:"
echo "1. Go to chrome://extensions/"
echo "2. Click RELOAD on JobScan Lite"
echo "3. Click the extension icon"
echo "4. Open Console (Right-click → Inspect)"
echo ""
echo "You should see:"
echo "  🚀 JobScan Lite Fixed Version Loading..."
echo "  ✅ JobScan Lite Ready!"
echo ""
echo "Then:"
echo "  - Paste job description and résumé"
echo "  - Click Analyze button"
echo "  - Move sliders"
echo "  - Try all features!"
echo ""

