/**
 * popup-simple.js - Simplified version for testing
 * If this works, we know the issue is with the complex version
 */

console.log('=== SIMPLE POPUP.JS LOADING ===');

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded!');
  
  // Test 1: Can we find buttons?
  const analyzeBtn = document.getElementById('analyzeBtn');
  const clearBtn = document.getElementById('clearBtn');
  const titleSlider = document.getElementById('titleWeight');
  
  console.log('Analyze button:', analyzeBtn ? 'FOUND' : 'NOT FOUND');
  console.log('Clear button:', clearBtn ? 'FOUND' : 'NOT FOUND');
  console.log('Title slider:', titleSlider ? 'FOUND' : 'NOT FOUND');
  
  // Test 2: Can we attach event listeners?
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', function() {
      console.log('🎉 ANALYZE BUTTON CLICKED!');
      alert('Analyze button works!');
    });
    console.log('✅ Analyze button listener attached');
  }
  
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      console.log('🎉 CLEAR BUTTON CLICKED!');
      alert('Clear button works!');
    });
    console.log('✅ Clear button listener attached');
  }
  
  // Test 3: Can we handle slider input?
  if (titleSlider) {
    titleSlider.addEventListener('input', function(e) {
      console.log('🎚️ SLIDER MOVED TO:', e.target.value);
      const valueDisplay = document.getElementById('titleWeightValue');
      if (valueDisplay) {
        valueDisplay.textContent = parseFloat(e.target.value).toFixed(1) + 'x';
      }
    });
    console.log('✅ Slider listener attached');
  }
  
  // Test 4: Can we load utilities?
  if (window.TextUtils) {
    console.log('✅ TextUtils available');
  } else {
    console.error('❌ TextUtils NOT available');
  }
  
  if (window.TFIDFUtils) {
    console.log('✅ TFIDFUtils available');
  } else {
    console.error('❌ TFIDFUtils NOT available');
  }
  
  console.log('=== SIMPLE SETUP COMPLETE ===');
});

console.log('=== SIMPLE POPUP.JS LOADED ===');

