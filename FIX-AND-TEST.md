# 🔧 Fix and Test Instructions

The buttons and sliders aren't working. Let's test and fix step by step.

## TEST 1: Simple Test Version (Start Here)

### Step 1: Use Test Manifest

```bash
cd /Users/ashleymaria/chrome-boiler/chrome-boiler/jobscan-lite

# Backup original manifest
cp manifest.json manifest-original.json

# Use test manifest
cp manifest-test.json manifest.json
```

### Step 2: Reload Extension

1. Go to `chrome://extensions/`
2. Find "JobScan Lite — TEST VERSION"
3. Click **Reload** 🔄

### Step 3: Test It

1. Click the extension icon
2. Open Console (Right-click → Inspect → Console)
3. You should see:
   ```
   === SIMPLE POPUP.JS LOADING ===
   DOM Content Loaded!
   Analyze button: FOUND
   Clear button: FOUND
   Title slider: FOUND
   ✅ Analyze button listener attached
   ✅ Clear button listener attached
   ✅ Slider listener attached
   ✅ TextUtils available
   ✅ TFIDFUtils available
   === SIMPLE SETUP COMPLETE ===
   ```

4. Click "Test Analyze Button" → Should show alert
5. Click "Test Clear Button" → Should show alert
6. Move slider → Value should update

### Result:
- ✅ **If this works:** The issue is with the full popup.js
- ❌ **If this doesn't work:** There's a deeper issue with Chrome or file loading

---

## TEST 2: Standalone HTML Test

Open `test.html` directly in Chrome:

```bash
# From the jobscan-lite directory
open test.html
# OR drag test.html into Chrome
```

This tests if the scripts work outside the extension context.

**Expected:** All buttons and sliders should work and log to console.

---

## TEST 3: Check File Loading

In the Console, run:

```javascript
// Check if DOM elements exist
console.log('analyzeBtn:', document.getElementById('analyzeBtn'));
console.log('titleWeight:', document.getElementById('titleWeight'));

// Check if utilities loaded
console.log('TextUtils:', window.TextUtils);
console.log('TFIDFUtils:', window.TFIDFUtils);

// Manual button click test
document.getElementById('analyzeBtn').addEventListener('click', () => {
  console.log('MANUAL LISTENER WORKS!');
});
```

Then click the Analyze button. If you see "MANUAL LISTENER WORKS!", the DOM is fine but our script isn't running.

---

## FIX 1: Restore Original with Fix

If the simple version works, let's fix the full version:

```bash
# Restore original manifest
cp manifest-original.json manifest.json

# Edit manifest.json to temporarily use popup-test.html
# Change line: "default_popup": "popup-test.html",
```

Then reload extension and test.

---

## FIX 2: Check Script Load Order

In Console, check what scripts loaded:

```javascript
performance.getEntriesByType('resource')
  .filter(r => r.name.includes('.js'))
  .forEach(r => console.log(r.name));
```

Should show:
- utils/text.js
- utils/tfidf.js  
- popup.js (or popup-simple.js)

---

## FIX 3: Content Security Policy

Add to manifest.json if needed:

```json
"content_security_policy": {
  "extension_pages": "script-src 'self'; object-src 'self'"
}
```

---

## FIX 4: Force Reload Everything

Sometimes Chrome caches aggressively:

1. Close ALL extension popups/windows
2. Go to `chrome://extensions/`
3. Turn OFF the extension
4. Click "Remove"
5. Restart Chrome
6. Load unpacked again
7. Test

---

## DIAGNOSTIC COMMANDS

Run these in Console to diagnose:

### Check Everything:
```javascript
console.log('=== DIAGNOSTIC ===');
console.log('Document ready state:', document.readyState);
console.log('Body:', document.body ? 'EXISTS' : 'MISSING');
console.log('Scripts loaded:', document.scripts.length);
console.log('analyzeBtn element:', document.getElementById('analyzeBtn'));
console.log('TextUtils:', typeof window.TextUtils);
console.log('TFIDFUtils:', typeof window.TFIDFUtils);

// List all scripts
Array.from(document.scripts).forEach(s => {
  console.log('Script:', s.src || 'inline');
});

// Check event listeners (Chrome only)
console.log('Analyze button listeners:', getEventListeners(document.getElementById('analyzeBtn')));
```

### Force Run Init:
```javascript
// If init function exists but didn't run
if (typeof init === 'function') {
  console.log('Running init manually...');
  init();
} else {
  console.log('init function not found');
}
```

---

## KNOWN ISSUES & SOLUTIONS

### Issue: "init is not defined"
**Cause:** popup.js didn't load or has syntax error  
**Fix:** Check Console for red errors, reload extension

### Issue: "TextUtils is undefined"
**Cause:** utils/text.js didn't load  
**Fix:** Check file exists, check path is correct, reload

### Issue: Buttons found but listeners not attached
**Cause:** setupEventListeners() never ran  
**Fix:** init() never executed, check if DOMContentLoaded fired

### Issue: Everything works in test.html but not in extension
**Cause:** Extension context restrictions  
**Fix:** Check manifest permissions, CSP policy

### Issue: Works first time, breaks on reload
**Cause:** LocalStorage or cached state issue  
**Fix:** Clear extension storage in DevTools → Application → Storage

---

## WORKING CHECKLIST

Go through this checklist:

- [ ] `test.html` works when opened in browser
- [ ] Test version (`popup-test.html`) works in extension
- [ ] Console shows "DOM Content Loaded!"
- [ ] Console shows all elements "FOUND"
- [ ] Console shows listeners "attached"
- [ ] Clicking buttons logs to console
- [ ] Moving sliders logs to console
- [ ] No red errors in console

If all checked, the simple version works and we can debug the full version.

If any unchecked, that's where the problem is.

---

## NEXT STEPS

1. **Start with TEST 1** above
2. Report what you see in the console
3. Tell me which checklist items pass/fail
4. I'll provide targeted fix based on results

The test version is deliberately simple so we can isolate the exact problem.

