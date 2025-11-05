/**
 * popup.js - Main application logic for JobScan Lite
 * Handles analysis, UI updates, localStorage, and user interactions
 */

// Import utilities from global namespace (loaded via script tags)
// These will be accessed after DOM loads
let STOPWORDS, HARD_SKILLS, SOFT_SKILLS, normalize, tokenize, extractPhrases;
let termFreq, idf, tfidf, cosineSim;

// DOM element references (initialized in init())
let elements = {};

// LocalStorage key
const STORAGE_KEY = 'jobscan-lite-v1';

// Current analysis results (kept in memory for export/copy)
let currentResults = null;

/**
 * Initialize the application
 */
function init() {
  console.log('🚀 JobScan Lite initializing...');
  
  // Import utilities from global namespace
  if (!window.TextUtils || !window.TFIDFUtils) {
    console.error('❌ Required utilities not loaded!');
    alert('Error: Extension failed to load properly. Please reload the extension.');
    return;
  }
  
  console.log('✅ Utilities loaded');
  
  ({ STOPWORDS, HARD_SKILLS, SOFT_SKILLS, normalize, tokenize, extractPhrases } = window.TextUtils);
  ({ termFreq, idf, tfidf, cosineSim } = window.TFIDFUtils);
  
  // Initialize DOM element references
  elements = {
    // Inputs
    jobTitle: document.getElementById('jobTitle'),
    jobDescription: document.getElementById('jobDescription'),
    resume: document.getElementById('resume'),
    
    // Settings
    titleWeight: document.getElementById('titleWeight'),
    hardSkillsWeight: document.getElementById('hardSkillsWeight'),
    softSkillsWeight: document.getElementById('softSkillsWeight'),
    removeStopwords: document.getElementById('removeStopwords'),
    
    // Value displays
    titleWeightValue: document.getElementById('titleWeightValue'),
    hardSkillsWeightValue: document.getElementById('hardSkillsWeightValue'),
    softSkillsWeightValue: document.getElementById('softSkillsWeightValue'),
    
    // Buttons
    analyzeBtn: document.getElementById('analyzeBtn'),
    clearBtn: document.getElementById('clearBtn'),
    exportBtn: document.getElementById('exportBtn'),
    copyBtn: document.getElementById('copyBtn'),
    sidePanelBtn: document.getElementById('sidePanelBtn'),
    
    // Results
    results: document.getElementById('results'),
    scoreNumber: document.getElementById('scoreNumber'),
    progressFill: document.getElementById('progressFill'),
    scoreNote: document.getElementById('scoreNote'),
    missingKeywords: document.getElementById('missingKeywords'),
    hardSkillsBody: document.getElementById('hardSkillsBody'),
    softSkillsBody: document.getElementById('softSkillsBody'),
    topTermsBody: document.getElementById('topTermsBody')
  };
  
  // Verify all critical elements were found
  const missingElements = [];
  for (const [key, element] of Object.entries(elements)) {
    if (!element) {
      missingElements.push(key);
    }
  }
  
  if (missingElements.length > 0) {
    console.error('❌ Missing DOM elements:', missingElements);
    alert('Error: Some UI elements could not be found. Please reload the extension.');
    return;
  }
  
  console.log('✅ All DOM elements found');
  
  // Set up event listeners
  setupEventListeners();
  console.log('✅ Event listeners attached');
  
  // Load saved state from localStorage
  loadState();
  
  // Update slider displays
  updateSliderDisplays();
  
  console.log('✅ JobScan Lite ready!');
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // Verify elements before attaching listeners
  if (!elements.analyzeBtn || !elements.titleWeight) {
    console.error('Critical elements missing in setupEventListeners');
    return;
  }
  
  // Slider value updates
  elements.titleWeight.addEventListener('input', (e) => {
    console.log('Title weight slider moved:', e.target.value);
    updateSliderDisplays();
  });
  elements.hardSkillsWeight.addEventListener('input', (e) => {
    console.log('Hard skills weight slider moved:', e.target.value);
    updateSliderDisplays();
  });
  elements.softSkillsWeight.addEventListener('input', (e) => {
    console.log('Soft skills weight slider moved:', e.target.value);
    updateSliderDisplays();
  });
  
  // Button clicks
  elements.analyzeBtn.addEventListener('click', () => {
    console.log('Analyze button clicked');
    runAnalysis();
  });
  elements.clearBtn.addEventListener('click', () => {
    console.log('Clear button clicked');
    clearAll();
  });
  elements.exportBtn.addEventListener('click', () => {
    console.log('Export button clicked');
    exportResults();
  });
  elements.copyBtn.addEventListener('click', () => {
    console.log('Copy button clicked');
    copyResults();
  });
  elements.sidePanelBtn.addEventListener('click', () => {
    console.log('Side panel button clicked');
    openSidePanel();
  });
  
  console.log('✅ Button listeners attached');
  
  // Auto-save on input changes (debounced)
  let saveTimeout;
  const autoSave = () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveState, 500);
  };
  
  elements.jobTitle.addEventListener('input', autoSave);
  elements.jobDescription.addEventListener('input', autoSave);
  elements.resume.addEventListener('input', autoSave);
  elements.titleWeight.addEventListener('change', autoSave);
  elements.hardSkillsWeight.addEventListener('change', autoSave);
  elements.softSkillsWeight.addEventListener('change', autoSave);
  elements.removeStopwords.addEventListener('change', autoSave);
  
  console.log('✅ Auto-save listeners attached');
}

/**
 * Update slider value displays
 */
function updateSliderDisplays() {
  console.log('Updating slider displays...');
  
  if (!elements.titleWeight || !elements.titleWeightValue) {
    console.error('Slider elements not found in updateSliderDisplays');
    return;
  }
  
  const titleValue = parseFloat(elements.titleWeight.value).toFixed(1);
  const hardValue = parseFloat(elements.hardSkillsWeight.value).toFixed(1);
  const softValue = parseFloat(elements.softSkillsWeight.value).toFixed(1);
  
  elements.titleWeightValue.textContent = `${titleValue}x`;
  elements.hardSkillsWeightValue.textContent = `${hardValue}x`;
  elements.softSkillsWeightValue.textContent = `${softValue}x`;
  
  console.log(`Slider values: Title=${titleValue}, Hard=${hardValue}, Soft=${softValue}`);
}

/**
 * Save current state to localStorage
 */
function saveState() {
  const state = {
    jobTitle: elements.jobTitle.value,
    jobDescription: elements.jobDescription.value,
    resume: elements.resume.value,
    titleWeight: elements.titleWeight.value,
    hardSkillsWeight: elements.hardSkillsWeight.value,
    softSkillsWeight: elements.softSkillsWeight.value,
    removeStopwords: elements.removeStopwords.checked
  };
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

/**
 * Load saved state from localStorage
 */
function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    
    const state = JSON.parse(saved);
    
    elements.jobTitle.value = state.jobTitle || '';
    elements.jobDescription.value = state.jobDescription || '';
    elements.resume.value = state.resume || '';
    elements.titleWeight.value = state.titleWeight || '1.2';
    elements.hardSkillsWeight.value = state.hardSkillsWeight || '1.5';
    elements.softSkillsWeight.value = state.softSkillsWeight || '1.0';
    elements.removeStopwords.checked = state.removeStopwords !== false;
    
  } catch (e) {
    console.error('Failed to load state:', e);
  }
}

/**
 * Clear all inputs and hide results
 */
function clearAll() {
  elements.jobTitle.value = '';
  elements.jobDescription.value = '';
  elements.resume.value = '';
  elements.results.classList.add('hidden');
  currentResults = null;
  saveState();
}

/**
 * Score skills by checking presence in JD and résumé
 * @param {string} jdText - Job description text
 * @param {string} resumeText - Résumé text
 * @returns {Object} - Object with hardSkills and softSkills arrays
 */
function scoreSkills(jdText, resumeText) {
  const jdPhrases = extractPhrases(jdText);
  const resumePhrases = extractPhrases(resumeText);
  
  const scoreSkillList = (skillsList) => {
    return skillsList.map(skill => {
      const skillNormalized = normalize(skill);
      return {
        skill,
        inJD: jdPhrases.has(skillNormalized) ? 1 : 0,
        inResume: resumePhrases.has(skillNormalized) ? 1 : 0
      };
    });
  };
  
  return {
    hardSkills: scoreSkillList(HARD_SKILLS),
    softSkills: scoreSkillList(SOFT_SKILLS)
  };
}

/**
 * Build TF-IDF vectors with weight boosts
 * @param {string} jdText - Job description text
 * @param {string} resumeText - Résumé text
 * @param {Object} options - Weights and settings
 * @returns {Object} - TF-IDF vectors and metadata
 */
function buildTFIDF(jdText, resumeText, options) {
  const { titleText, titleWeight, hardWeight, softWeight, useStopwords } = options;
  
  // Tokenize both documents
  let jdTokens = tokenize(jdText, useStopwords);
  const resumeTokens = tokenize(resumeText, useStopwords);
  
  // Boost job title tokens if provided
  if (titleText && titleText.trim()) {
    const titleTokens = tokenize(titleText, useStopwords);
    const titleBoost = Math.round((titleWeight - 1.0) * 2);
    
    for (let i = 0; i < titleBoost; i++) {
      jdTokens = jdTokens.concat(titleTokens);
    }
  }
  
  // Get skills scoring
  const skillsScoring = scoreSkills(jdText, resumeText);
  
  // Boost hard skills tokens
  const jdHardSkills = skillsScoring.hardSkills
    .filter(s => s.inJD === 1)
    .map(s => tokenize(s.skill, useStopwords))
    .flat();
  
  const hardBoost = Math.round((hardWeight - 1.0) * 2);
  for (let i = 0; i < hardBoost; i++) {
    jdTokens = jdTokens.concat(jdHardSkills);
  }
  
  // Boost soft skills tokens
  const jdSoftSkills = skillsScoring.softSkills
    .filter(s => s.inJD === 1)
    .map(s => tokenize(s.skill, useStopwords))
    .flat();
  
  const softBoost = Math.round((softWeight - 1.0) * 2);
  for (let i = 0; i < softBoost; i++) {
    jdTokens = jdTokens.concat(jdSoftSkills);
  }
  
  // Build TF-IDF
  const jdSet = new Set(jdTokens);
  const resumeSet = new Set(resumeTokens);
  
  const idfMap = idf([jdSet, resumeSet]);
  
  const jdTF = termFreq(jdTokens);
  const resumeTF = termFreq(resumeTokens);
  
  const jdTFIDF = tfidf(jdTF, idfMap);
  const resumeTFIDF = tfidf(resumeTF, idfMap);
  
  return {
    jdTFIDF,
    resumeTFIDF,
    jdTokens,
    resumeTokens,
    skillsScoring
  };
}

/**
 * Compute top terms by max TF-IDF score across documents
 * @param {Map} jdTFIDF - JD TF-IDF scores
 * @param {Map} resumeTFIDF - Résumé TF-IDF scores
 * @param {number} k - Number of top terms to return
 * @returns {Array} - Array of {term, jdScore, resumeScore}
 */
function computeTopTerms(jdTFIDF, resumeTFIDF, k = 20) {
  const allTerms = new Set([...jdTFIDF.keys(), ...resumeTFIDF.keys()]);
  
  const termScores = Array.from(allTerms).map(term => {
    const jdScore = jdTFIDF.get(term) || 0;
    const resumeScore = resumeTFIDF.get(term) || 0;
    const maxScore = Math.max(jdScore, resumeScore);
    
    return { term, jdScore, resumeScore, maxScore };
  });
  
  // Sort by max score descending
  termScores.sort((a, b) => b.maxScore - a.maxScore);
  
  return termScores.slice(0, k);
}

/**
 * List missing keywords from JD that are not in résumé
 * @param {string} jdText - Job description text
 * @param {string} resumeText - Résumé text
 * @param {boolean} useStopwords - Whether stopwords were removed
 * @returns {Array} - Array of missing keyword strings
 */
function listMissingKeywords(jdText, resumeText, useStopwords) {
  const jdTokens = tokenize(jdText, useStopwords);
  const resumeTokens = new Set(tokenize(resumeText, useStopwords));
  
  // Find unique tokens in JD not in résumé
  const missing = new Set();
  
  for (const token of jdTokens) {
    // Skip very short tokens (2 chars or less) and pure numbers
    if (token.length <= 2 || /^\d+$/.test(token)) continue;
    
    if (!resumeTokens.has(token)) {
      missing.add(token);
    }
  }
  
  // Limit to ~60 keywords
  return Array.from(missing).slice(0, 60);
}

/**
 * Identify critical missing keywords
 * @param {Array} missingKeywords - All missing keywords
 * @param {Array} topTerms - Top TF-IDF terms
 * @param {Object} skillsScoring - Skills scoring data
 * @returns {Set} - Set of critical keywords
 */
function identifyCriticalKeywords(missingKeywords, topTerms, skillsScoring) {
  const critical = new Set();
  
  // Add missing hard skills from JD
  skillsScoring.hardSkills.forEach(s => {
    if (s.inJD === 1 && s.inResume === 0) {
      const tokens = tokenize(s.skill, false); // Don't remove stopwords for skill names
      tokens.forEach(t => critical.add(t));
    }
  });
  
  // Add missing soft skills from JD
  skillsScoring.softSkills.forEach(s => {
    if (s.inJD === 1 && s.inResume === 0) {
      const tokens = tokenize(s.skill, false);
      tokens.forEach(t => critical.add(t));
    }
  });
  
  // Add top 10 JD TF-IDF terms that are missing
  const top10Terms = topTerms.slice(0, 10).map(t => t.term);
  top10Terms.forEach(term => {
    if (missingKeywords.includes(term)) {
      critical.add(term);
    }
  });
  
  return critical;
}

/**
 * Get score note based on score band
 * @param {number} score - Match score 0-100
 * @returns {string} - Note text
 */
function getScoreNote(score) {
  if (score >= 85) {
    return "Excellent match — you're highly aligned with this job description.";
  } else if (score >= 70) {
    return "Strong match — consider adding missing keywords for an extra boost.";
  } else if (score >= 55) {
    return "Decent match — consider tailoring your achievements to better reflect the job requirements.";
  } else {
    return "Low match — customize your résumé for this specific role to improve your chances.";
  }
}

/**
 * Run the analysis and display results
 */
function runAnalysis() {
  try {
    console.log('Analysis started...');
    
    const jdText = elements.jobDescription.value.trim();
    const resumeText = elements.resume.value.trim();
    
    console.log('JD length:', jdText.length, 'Resume length:', resumeText.length);
    
    // Validation
    if (!jdText || !resumeText) {
      alert('Please provide both Job Description and Résumé to analyze.');
      return;
    }
    
    // Get settings
    const titleText = elements.jobTitle.value.trim();
    const titleWeight = parseFloat(elements.titleWeight.value);
    const hardWeight = parseFloat(elements.hardSkillsWeight.value);
    const softWeight = parseFloat(elements.softSkillsWeight.value);
    const useStopwords = elements.removeStopwords.checked;
    
    console.log('Settings:', { titleWeight, hardWeight, softWeight, useStopwords });
    
    // Build TF-IDF with boosts
    console.log('Building TF-IDF...');
    const { jdTFIDF, resumeTFIDF, jdTokens, resumeTokens, skillsScoring } = buildTFIDF(
      jdText,
      resumeText,
      { titleText, titleWeight, hardWeight, softWeight, useStopwords }
    );
    
    // Calculate cosine similarity and scale to 0-100
    console.log('Calculating similarity...');
    const similarity = cosineSim(jdTFIDF, resumeTFIDF);
    const score = Math.round(Math.max(0, Math.min(100, similarity * 100)));
    console.log('Score:', score);
    
    // Compute top terms
    const topTerms = computeTopTerms(jdTFIDF, resumeTFIDF, 20);
    
    // List missing keywords
    const missingKeywords = listMissingKeywords(jdText, resumeText, useStopwords);
    
    // Identify critical keywords
    const criticalKeywords = identifyCriticalKeywords(missingKeywords, topTerms, skillsScoring);
    
    // Store results
    currentResults = {
      score,
      note: getScoreNote(score),
      missingKeywords,
      criticalKeywords,
      hardSkills: skillsScoring.hardSkills,
      softSkills: skillsScoring.softSkills,
      topTerms
    };
    
    console.log('Displaying results...');
    // Display results
    displayResults(currentResults);
    
    // Save state
    saveState();
    
    console.log('Analysis complete!');
  } catch (error) {
    console.error('Error during analysis:', error);
    alert('An error occurred during analysis: ' + error.message);
  }
}

/**
 * Display analysis results in the UI
 * @param {Object} results - Analysis results
 */
function displayResults(results) {
  const { score, note, missingKeywords, criticalKeywords, hardSkills, softSkills, topTerms } = results;
  
  // Show results section
  elements.results.classList.remove('hidden');
  
  // Display score
  elements.scoreNumber.textContent = score;
  elements.progressFill.style.width = `${score}%`;
  elements.scoreNote.textContent = note;
  
  // Display missing keywords
  elements.missingKeywords.innerHTML = '';
  
  if (missingKeywords.length === 0) {
    elements.missingKeywords.innerHTML = '<span class="text-muted">No missing keywords — great job!</span>';
  } else {
    missingKeywords.forEach(keyword => {
      const tag = document.createElement('span');
      tag.className = 'keyword-tag';
      
      if (criticalKeywords.has(keyword)) {
        tag.classList.add('critical');
      }
      
      tag.textContent = keyword;
      elements.missingKeywords.appendChild(tag);
    });
  }
  
  // Display hard skills table
  elements.hardSkillsBody.innerHTML = '';
  
  // Filter to only skills that appear in at least JD or résumé
  const relevantHardSkills = hardSkills.filter(s => s.inJD === 1 || s.inResume === 1);
  
  if (relevantHardSkills.length === 0) {
    elements.hardSkillsBody.innerHTML = '<tr><td colspan="3" class="text-muted">No hard skills detected</td></tr>';
  } else {
    relevantHardSkills.forEach(s => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${s.skill}</td>
        <td class="text-center ${s.inJD ? 'present' : 'absent'}">${s.inJD}</td>
        <td class="text-center ${s.inResume ? 'present' : 'absent'}">${s.inResume}</td>
      `;
      elements.hardSkillsBody.appendChild(row);
    });
  }
  
  // Display soft skills table
  elements.softSkillsBody.innerHTML = '';
  
  const relevantSoftSkills = softSkills.filter(s => s.inJD === 1 || s.inResume === 1);
  
  if (relevantSoftSkills.length === 0) {
    elements.softSkillsBody.innerHTML = '<tr><td colspan="3" class="text-muted">No soft skills detected</td></tr>';
  } else {
    relevantSoftSkills.forEach(s => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${s.skill}</td>
        <td class="text-center ${s.inJD ? 'present' : 'absent'}">${s.inJD}</td>
        <td class="text-center ${s.inResume ? 'present' : 'absent'}">${s.inResume}</td>
      `;
      elements.softSkillsBody.appendChild(row);
    });
  }
  
  // Display top terms table
  elements.topTermsBody.innerHTML = '';
  
  topTerms.forEach(t => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${t.term}</td>
      <td class="text-center">${t.jdScore.toFixed(3)}</td>
      <td class="text-center">${t.resumeScore.toFixed(3)}</td>
    `;
    elements.topTermsBody.appendChild(row);
  });
  
  // Scroll to results
  elements.results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Export results to a .txt file
 */
function exportResults() {
  if (!currentResults) {
    alert('Please run an analysis first before exporting.');
    return;
  }
  
  const { score, note, missingKeywords, hardSkills, softSkills, topTerms } = currentResults;
  
  // Build text content
  let content = 'JobScan Lite — Analysis Results\n';
  content += '='.repeat(50) + '\n\n';
  
  content += `Match Score: ${score}/100\n`;
  content += `Note: ${note}\n\n`;
  
  content += 'Missing Keywords\n';
  content += '-'.repeat(50) + '\n';
  content += missingKeywords.length > 0 
    ? missingKeywords.join(', ') + '\n\n'
    : 'None — excellent coverage!\n\n';
  
  content += 'Hard Skills Coverage\n';
  content += '-'.repeat(50) + '\n';
  const relevantHardSkills = hardSkills.filter(s => s.inJD === 1 || s.inResume === 1);
  if (relevantHardSkills.length > 0) {
    content += 'Skill | In JD | In Résumé\n';
    relevantHardSkills.forEach(s => {
      content += `${s.skill} | ${s.inJD} | ${s.inResume}\n`;
    });
  } else {
    content += 'No hard skills detected\n';
  }
  content += '\n';
  
  content += 'Soft Skills Coverage\n';
  content += '-'.repeat(50) + '\n';
  const relevantSoftSkills = softSkills.filter(s => s.inJD === 1 || s.inResume === 1);
  if (relevantSoftSkills.length > 0) {
    content += 'Skill | In JD | In Résumé\n';
    relevantSoftSkills.forEach(s => {
      content += `${s.skill} | ${s.inJD} | ${s.inResume}\n`;
    });
  } else {
    content += 'No soft skills detected\n';
  }
  content += '\n';
  
  content += 'Top Terms (TF-IDF)\n';
  content += '-'.repeat(50) + '\n';
  content += 'Term | JD Score | Résumé Score\n';
  topTerms.forEach(t => {
    content += `${t.term} | ${t.jdScore.toFixed(3)} | ${t.resumeScore.toFixed(3)}\n`;
  });
  
  content += '\n' + '='.repeat(50) + '\n';
  content += 'Generated by JobScan Lite — Offline Keyword Match\n';
  
  // Create and download file
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `jobscan-results-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Copy results to clipboard
 */
async function copyResults() {
  if (!currentResults) {
    alert('Please run an analysis first before copying.');
    return;
  }
  
  const { score, note, missingKeywords, hardSkills, softSkills, topTerms } = currentResults;
  
  // Build text content (same as export)
  let content = 'JobScan Lite — Analysis Results\n';
  content += '='.repeat(50) + '\n\n';
  
  content += `Match Score: ${score}/100\n`;
  content += `Note: ${note}\n\n`;
  
  content += 'Missing Keywords\n';
  content += '-'.repeat(50) + '\n';
  content += missingKeywords.length > 0 
    ? missingKeywords.join(', ') + '\n\n'
    : 'None — excellent coverage!\n\n';
  
  content += 'Hard Skills Coverage\n';
  content += '-'.repeat(50) + '\n';
  const relevantHardSkills = hardSkills.filter(s => s.inJD === 1 || s.inResume === 1);
  if (relevantHardSkills.length > 0) {
    content += 'Skill | In JD | In Résumé\n';
    relevantHardSkills.forEach(s => {
      content += `${s.skill} | ${s.inJD} | ${s.inResume}\n`;
    });
  } else {
    content += 'No hard skills detected\n';
  }
  content += '\n';
  
  content += 'Soft Skills Coverage\n';
  content += '-'.repeat(50) + '\n';
  const relevantSoftSkills = softSkills.filter(s => s.inJD === 1 || s.inResume === 1);
  if (relevantSoftSkills.length > 0) {
    content += 'Skill | In JD | In Résumé\n';
    relevantSoftSkills.forEach(s => {
      content += `${s.skill} | ${s.inJD} | ${s.inResume}\n`;
    });
  } else {
    content += 'No soft skills detected\n';
  }
  content += '\n';
  
  content += 'Top Terms (TF-IDF)\n';
  content += '-'.repeat(50) + '\n';
  content += 'Term | JD Score | Résumé Score\n';
  topTerms.forEach(t => {
    content += `${t.term} | ${t.jdScore.toFixed(3)} | ${t.resumeScore.toFixed(3)}\n`;
  });
  
  // Copy to clipboard
  try {
    await navigator.clipboard.writeText(content);
    
    // Show brief "Copied!" feedback
    const originalText = elements.copyBtn.textContent;
    elements.copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      elements.copyBtn.textContent = originalText;
    }, 1500);
    
  } catch (err) {
    console.error('Failed to copy:', err);
    alert('Failed to copy to clipboard. Please try again.');
  }
}

/**
 * Open the extension in a side panel for persistent access
 */
function openSidePanel() {
  // Save state before opening side panel
  saveState();
  
  // Check if chrome.runtime is available (it should be in extension context)
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage({ action: 'openSidePanel' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error opening side panel:', chrome.runtime.lastError);
        alert('Could not open side panel. This feature requires Chrome 114 or later.');
      } else if (response && response.success) {
        console.log('Side panel opened successfully');
        // The popup will close automatically when side panel opens
      } else {
        console.error('Failed to open side panel:', response?.error);
        alert('Failed to open side panel. Please try again.');
      }
    });
  } else {
    alert('Side panel feature is not available in this context.');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

