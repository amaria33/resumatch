# 🔧 Troubleshooting Guide

## Buttons Not Working / Sliders Not Responding

If the buttons don't respond when clicked or sliders don't update values, follow these steps:

### Step 1: Open DevTools Console

1. **Right-click** anywhere in the extension popup
2. Select **"Inspect"** or press `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
3. Click the **Console** tab

### Step 2: Check Initialization Logs

You should see these messages in the console:

```
🚀 JobScan Lite initializing...
✅ Utilities loaded
✅ All DOM elements found
Setting up event listeners...
✅ Button listeners attached
✅ Auto-save listeners attached
Updating slider displays...
Slider values: Title=1.2, Hard=1.5, Soft=1.0
✅ JobScan Lite ready!
```

### Step 3: Test Event Listeners

In the **Console** tab, try these commands:

```javascript
// Check if utilities are loaded
console.log(window.TextUtils);
console.log(window.TFIDFUtils);

// Should show objects with functions, NOT undefined
```

If either shows `undefined`, the utility scripts didn't load properly.

### Step 4: Reload the Extension

1. Go to `chrome://extensions/`
2. Find "JobScan Lite"
3. Click the **reload icon** 🔄
4. **Close and reopen** the extension popup
5. Check the console again

### Step 5: Check for Errors

Look for any **red error messages** in the Console. Common issues:

#### ❌ "Required utilities not loaded!"
- **Fix:** Reload the extension (see Step 4)
- Make sure all files are in the correct locations:
  - `utils/text.js`
  - `utils/tfidf.js`
  - `popup.js`

#### ❌ "Missing DOM elements: [...]"
- **Fix:** The HTML file may be corrupted
- Reload the extension
- If problem persists, reinstall the extension

#### ❌ "Critical elements missing in setupEventListeners"
- **Fix:** This means DOM elements weren't found
- Check that `popup.html` has all required IDs
- Reload the extension

### Step 6: Manual Test

Try these commands in the Console to manually test:

```javascript
// Check if buttons exist
console.log(document.getElementById('analyzeBtn'));
console.log(document.getElementById('titleWeight'));

// Should show the HTML elements, NOT null
```

### Step 7: Test Button Click Manually

In the Console, try:

```javascript
// This should trigger the analyze function
document.getElementById('analyzeBtn').click();
```

If nothing happens, check if there are any error messages.

### Step 8: Check Slider Functionality

In the Console, try:

```javascript
// This should update the slider display
document.getElementById('titleWeight').value = "1.5";
document.getElementById('titleWeight').dispatchEvent(new Event('input'));
```

The displayed value should change to "1.5x".

## Common Solutions

### Complete Reset

If nothing works:

1. **Remove the extension:**
   - Go to `chrome://extensions/`
   - Click "Remove" on JobScan Lite

2. **Clear extension data:**
   - Press F12 in Chrome
   - Go to Application tab → Storage → Clear site data

3. **Reinstall:**
   - Load unpacked extension again
   - Make sure to select the `jobscan-lite` folder

### Browser Issues

- **Update Chrome:** The extension requires Chrome 114+
- **Disable other extensions:** Some extensions can interfere
- **Try Incognito mode:** Right-click extension icon → Manage → Allow in Incognito

### File Issues

Verify file structure:
```
jobscan-lite/
├── manifest.json
├── popup.html
├── popup.js
├── background.js
├── styles.css
├── utils/
│   ├── text.js
│   └── tfidf.js
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### Still Not Working?

1. **Check Chrome version:**
   - Go to `chrome://settings/help`
   - Should be Chrome 114 or later

2. **Test in regular popup first:**
   - Don't use side panel until basic popup works
   - Side panel has additional requirements

3. **Look for Content Security Policy errors:**
   - Check Console for CSP errors
   - These appear as red errors about "refused to execute"

## Getting Help

If you're still stuck, provide this information:

1. Chrome version (`chrome://settings/help`)
2. Operating system
3. Full console output (copy all logs)
4. Which specific buttons/features don't work
5. Any error messages (exact text)

## Quick Diagnostic Script

Paste this into the Console to get a diagnostic report:

```javascript
console.log('=== DIAGNOSTIC REPORT ===');
console.log('Chrome Version:', navigator.userAgent);
console.log('Window.TextUtils:', typeof window.TextUtils);
console.log('Window.TFIDFUtils:', typeof window.TFIDFUtils);
console.log('Analyze Button:', document.getElementById('analyzeBtn') ? 'Found' : 'MISSING');
console.log('Title Weight Slider:', document.getElementById('titleWeight') ? 'Found' : 'MISSING');
console.log('Job Description Field:', document.getElementById('jobDescription') ? 'Found' : 'MISSING');
console.log('Resume Field:', document.getElementById('resume') ? 'Found' : 'MISSING');
console.log('=== END REPORT ===');
```

Copy the output and review for any "MISSING" or "undefined" values.

