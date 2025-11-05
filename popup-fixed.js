/**
 * popup-fixed.js - Fixed version with guaranteed working event listeners
 * This version uses a simpler, more reliable approach
 */

(function() {
  'use strict';
  
  console.log('🚀 ResuMatch Fixed Version Loading...');
  
  // Global state
  let TextUtils, TFIDFUtils;
  let elements = {};
  let currentResults = null;
  const STORAGE_KEY = 'jobscan-lite-v1';
  
  /**
   * Initialize the application when DOM is ready
   */
  function initialize() {
    console.log('📦 Initializing...');
    
    // Load utilities
    if (!window.TextUtils || !window.TFIDFUtils) {
      console.error('❌ Utilities not loaded');
      alert('Error: Extension utilities failed to load. Please reload.');
      return;
    }
    
    TextUtils = window.TextUtils;
    TFIDFUtils = window.TFIDFUtils;
    console.log('✅ Utilities loaded');
    
    // Get all DOM elements
    elements = {
      jobTitle: document.getElementById('jobTitle'),
      jobDescription: document.getElementById('jobDescription'),
      resume: document.getElementById('resume'),
      titleWeight: document.getElementById('titleWeight'),
      hardSkillsWeight: document.getElementById('hardSkillsWeight'),
      softSkillsWeight: document.getElementById('softSkillsWeight'),
      removeStopwords: document.getElementById('removeStopwords'),
      titleWeightValue: document.getElementById('titleWeightValue'),
      hardSkillsWeightValue: document.getElementById('hardSkillsWeightValue'),
      softSkillsWeightValue: document.getElementById('softSkillsWeightValue'),
      analyzeBtn: document.getElementById('analyzeBtn'),
      clearBtn: document.getElementById('clearBtn'),
      exportBtn: document.getElementById('exportBtn'),
      copyBtn: document.getElementById('copyBtn'),
      sidePanelBtn: document.getElementById('sidePanelBtn'),
      results: document.getElementById('results'),
      scoreNumber: document.getElementById('scoreNumber'),
      progressFill: document.getElementById('progressFill'),
      scoreNote: document.getElementById('scoreNote'),
      missingKeywords: document.getElementById('missingKeywords'),
      hardSkillsBody: document.getElementById('hardSkillsBody'),
      softSkillsBody: document.getElementById('softSkillsBody'),
      topTermsBody: document.getElementById('topTermsBody')
    };
    
    // Verify critical elements
    const critical = ['analyzeBtn', 'jobDescription', 'resume', 'titleWeight'];
    const missing = critical.filter(key => !elements[key]);
    
    if (missing.length > 0) {
      console.error('❌ Missing elements:', missing);
      alert('Error: Some UI elements are missing. Please reload.');
      return;
    }
    
    console.log('✅ All DOM elements found');
    
    // Attach event listeners
    attachEventListeners();
    
    // Load saved state
    loadState();
    
    // Update slider displays
    updateSliderDisplays();
    
    console.log('✅ ResuMatch Ready!');
  }
  
  /**
   * Attach all event listeners
   */
  function attachEventListeners() {
    console.log('🔗 Attaching event listeners...');
    
    // Buttons
    elements.analyzeBtn.onclick = function() {
      console.log('🔍 Analyze clicked');
      runAnalysis();
    };
    
    elements.clearBtn.onclick = function() {
      console.log('🗑️ Clear clicked');
      clearAll();
    };
    
    elements.exportBtn.onclick = function() {
      console.log('💾 Export clicked');
      exportResults();
    };
    
    elements.copyBtn.onclick = function() {
      console.log('📋 Copy clicked');
      copyResults();
    };
    
    if (elements.sidePanelBtn) {
      elements.sidePanelBtn.onclick = function() {
        console.log('📌 Side panel clicked');
        openSidePanel();
      };
    }
    
    // Sliders
    elements.titleWeight.oninput = function() {
      console.log('🎚️ Title weight:', this.value);
      updateSliderDisplays();
    };
    
    elements.hardSkillsWeight.oninput = function() {
      console.log('🎚️ Hard skills weight:', this.value);
      updateSliderDisplays();
    };
    
    elements.softSkillsWeight.oninput = function() {
      console.log('🎚️ Soft skills weight:', this.value);
      updateSliderDisplays();
    };
    
    // Auto-save
    let saveTimeout;
    const autoSave = function() {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(saveState, 500);
    };
    
    elements.jobTitle.oninput = autoSave;
    elements.jobDescription.oninput = autoSave;
    elements.resume.oninput = autoSave;
    elements.titleWeight.onchange = autoSave;
    elements.hardSkillsWeight.onchange = autoSave;
    elements.softSkillsWeight.onchange = autoSave;
    elements.removeStopwords.onchange = autoSave;
    
    console.log('✅ Event listeners attached');
  }
  
  /**
   * Update slider value displays
   */
  function updateSliderDisplays() {
    elements.titleWeightValue.textContent = parseFloat(elements.titleWeight.value).toFixed(1) + 'x';
    elements.hardSkillsWeightValue.textContent = parseFloat(elements.hardSkillsWeight.value).toFixed(1) + 'x';
    elements.softSkillsWeightValue.textContent = parseFloat(elements.softSkillsWeight.value).toFixed(1) + 'x';
  }
  
  /**
   * Save state to localStorage
   */
  function saveState() {
    try {
      const state = {
        jobTitle: elements.jobTitle.value,
        jobDescription: elements.jobDescription.value,
        resume: elements.resume.value,
        titleWeight: elements.titleWeight.value,
        hardSkillsWeight: elements.hardSkillsWeight.value,
        softSkillsWeight: elements.softSkillsWeight.value,
        removeStopwords: elements.removeStopwords.checked
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }
  
  /**
   * Load state from localStorage
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
      
      updateSliderDisplays();
    } catch (e) {
      console.error('Failed to load state:', e);
    }
  }
  
  /**
   * Clear all inputs
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
   * Run analysis
   */
  function runAnalysis() {
    try {
      console.log('🔍 Starting analysis...');
      
      const jdText = elements.jobDescription.value.trim();
      const resumeText = elements.resume.value.trim();
      
      if (!jdText || !resumeText) {
        alert('Please provide both Job Description and Résumé.');
        return;
      }
      
      const settings = {
        titleText: elements.jobTitle.value.trim(),
        titleWeight: parseFloat(elements.titleWeight.value),
        hardWeight: parseFloat(elements.hardSkillsWeight.value),
        softWeight: parseFloat(elements.softSkillsWeight.value),
        useStopwords: elements.removeStopwords.checked
      };
      
      console.log('Settings:', settings);
      
      // Build TF-IDF
      const analysis = buildTFIDF(jdText, resumeText, settings);
      
      // Calculate similarity
      const similarity = TFIDFUtils.cosineSim(analysis.jdTFIDF, analysis.resumeTFIDF);
      const score = Math.round(Math.max(0, Math.min(100, similarity * 100)));
      
      console.log('Score:', score);
      
      // Get results
      const topTerms = computeTopTerms(analysis.jdTFIDF, analysis.resumeTFIDF, 20);
      const missingKeywords = listMissingKeywords(jdText, resumeText, settings.useStopwords);
      const criticalKeywords = identifyCriticalKeywords(missingKeywords, topTerms, analysis.skillsScoring);
      
      currentResults = {
        score,
        note: getScoreNote(score),
        missingKeywords,
        criticalKeywords,
        hardSkills: analysis.skillsScoring.hardSkills,
        softSkills: analysis.skillsScoring.softSkills,
        topTerms
      };
      
      displayResults(currentResults);
      saveState();
      
      console.log('✅ Analysis complete');
    } catch (error) {
      console.error('Analysis error:', error);
      alert('An error occurred: ' + error.message);
    }
  }
  
  /**
   * Build TF-IDF with weights
   */
  function buildTFIDF(jdText, resumeText, settings) {
    let jdTokens = TextUtils.tokenize(jdText, settings.useStopwords);
    const resumeTokens = TextUtils.tokenize(resumeText, settings.useStopwords);
    
    // Boost title tokens
    if (settings.titleText) {
      const titleTokens = TextUtils.tokenize(settings.titleText, settings.useStopwords);
      const titleBoost = Math.round((settings.titleWeight - 1.0) * 2);
      for (let i = 0; i < titleBoost; i++) {
        jdTokens = jdTokens.concat(titleTokens);
      }
    }
    
    // Score skills
    const skillsScoring = scoreSkills(jdText, resumeText);
    
    // Boost hard skills
    const jdHardSkills = skillsScoring.hardSkills
      .filter(s => s.inJD === 1)
      .map(s => TextUtils.tokenize(s.skill, settings.useStopwords))
      .flat();
    
    const hardBoost = Math.round((settings.hardWeight - 1.0) * 2);
    for (let i = 0; i < hardBoost; i++) {
      jdTokens = jdTokens.concat(jdHardSkills);
    }
    
    // Boost soft skills
    const jdSoftSkills = skillsScoring.softSkills
      .filter(s => s.inJD === 1)
      .map(s => TextUtils.tokenize(s.skill, settings.useStopwords))
      .flat();
    
    const softBoost = Math.round((settings.softWeight - 1.0) * 2);
    for (let i = 0; i < softBoost; i++) {
      jdTokens = jdTokens.concat(jdSoftSkills);
    }
    
    // Calculate TF-IDF
    const jdSet = new Set(jdTokens);
    const resumeSet = new Set(resumeTokens);
    const idfMap = TFIDFUtils.idf([jdSet, resumeSet]);
    const jdTF = TFIDFUtils.termFreq(jdTokens);
    const resumeTF = TFIDFUtils.termFreq(resumeTokens);
    const jdTFIDF = TFIDFUtils.tfidf(jdTF, idfMap);
    const resumeTFIDF = TFIDFUtils.tfidf(resumeTF, idfMap);
    
    return { jdTFIDF, resumeTFIDF, jdTokens, resumeTokens, skillsScoring };
  }
  
  /**
   * Score skills presence
   */
  function scoreSkills(jdText, resumeText) {
    const jdPhrases = TextUtils.extractPhrases(jdText);
    const resumePhrases = TextUtils.extractPhrases(resumeText);
    
    const scoreList = (skills) => skills.map(skill => {
      const normalized = TextUtils.normalize(skill);
      return {
        skill,
        inJD: jdPhrases.has(normalized) ? 1 : 0,
        inResume: resumePhrases.has(normalized) ? 1 : 0
      };
    });
    
    return {
      hardSkills: scoreList(TextUtils.HARD_SKILLS),
      softSkills: scoreList(TextUtils.SOFT_SKILLS)
    };
  }
  
  /**
   * Compute top terms
   */
  function computeTopTerms(jdTFIDF, resumeTFIDF, k) {
    const allTerms = new Set([...jdTFIDF.keys(), ...resumeTFIDF.keys()]);
    const scores = Array.from(allTerms).map(term => ({
      term,
      jdScore: jdTFIDF.get(term) || 0,
      resumeScore: resumeTFIDF.get(term) || 0,
      maxScore: Math.max(jdTFIDF.get(term) || 0, resumeTFIDF.get(term) || 0)
    }));
    
    scores.sort((a, b) => b.maxScore - a.maxScore);
    return scores.slice(0, k);
  }
  
  /**
   * List missing keywords
   */
  function listMissingKeywords(jdText, resumeText, useStopwords) {
    const jdTokens = TextUtils.tokenize(jdText, useStopwords);
    const resumeTokens = new Set(TextUtils.tokenize(resumeText, useStopwords));
    const missing = new Set();
    
    for (const token of jdTokens) {
      if (token.length > 2 && !/^\d+$/.test(token) && !resumeTokens.has(token)) {
        missing.add(token);
      }
    }
    
    return Array.from(missing).slice(0, 60);
  }
  
  /**
   * Identify critical keywords
   */
  function identifyCriticalKeywords(missing, topTerms, skillsScoring) {
    const critical = new Set();
    
    skillsScoring.hardSkills.forEach(s => {
      if (s.inJD === 1 && s.inResume === 0) {
        TextUtils.tokenize(s.skill, false).forEach(t => critical.add(t));
      }
    });
    
    skillsScoring.softSkills.forEach(s => {
      if (s.inJD === 1 && s.inResume === 0) {
        TextUtils.tokenize(s.skill, false).forEach(t => critical.add(t));
      }
    });
    
    topTerms.slice(0, 10).forEach(t => {
      if (missing.includes(t.term)) critical.add(t.term);
    });
    
    return critical;
  }
  
  /**
   * Get score note
   */
  function getScoreNote(score) {
    if (score >= 85) return "Excellent match — you're highly aligned with this job description.";
    if (score >= 70) return "Strong match — consider adding missing keywords for an extra boost.";
    if (score >= 55) return "Decent match — consider tailoring your achievements to better reflect the job requirements.";
    return "Low match — customize your résumé for this specific role to improve your chances.";
  }
  
  /**
   * Display results
   */
  function displayResults(results) {
    elements.results.classList.remove('hidden');
    
    // Score
    elements.scoreNumber.textContent = results.score;
    elements.progressFill.style.width = results.score + '%';
    elements.scoreNote.textContent = results.note;
    
    // Missing keywords
    elements.missingKeywords.innerHTML = '';
    if (results.missingKeywords.length === 0) {
      elements.missingKeywords.innerHTML = '<span class="text-muted">No missing keywords!</span>';
    } else {
      results.missingKeywords.forEach(keyword => {
        const tag = document.createElement('span');
        tag.className = 'keyword-tag';
        if (results.criticalKeywords.has(keyword)) tag.classList.add('critical');
        tag.textContent = keyword;
        elements.missingKeywords.appendChild(tag);
      });
    }
    
    // Hard skills
    elements.hardSkillsBody.innerHTML = '';
    const relevantHard = results.hardSkills.filter(s => s.inJD === 1 || s.inResume === 1);
    if (relevantHard.length === 0) {
      elements.hardSkillsBody.innerHTML = '<tr><td colspan="3" class="text-muted">No hard skills detected</td></tr>';
    } else {
      relevantHard.forEach(s => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${s.skill}</td>
          <td class="text-center ${s.inJD ? 'present' : 'absent'}">${s.inJD}</td>
          <td class="text-center ${s.inResume ? 'present' : 'absent'}">${s.inResume}</td>
        `;
        elements.hardSkillsBody.appendChild(row);
      });
    }
    
    // Soft skills
    elements.softSkillsBody.innerHTML = '';
    const relevantSoft = results.softSkills.filter(s => s.inJD === 1 || s.inResume === 1);
    if (relevantSoft.length === 0) {
      elements.softSkillsBody.innerHTML = '<tr><td colspan="3" class="text-muted">No soft skills detected</td></tr>';
    } else {
      relevantSoft.forEach(s => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${s.skill}</td>
          <td class="text-center ${s.inJD ? 'present' : 'absent'}">${s.inJD}</td>
          <td class="text-center ${s.inResume ? 'present' : 'absent'}">${s.inResume}</td>
        `;
        elements.softSkillsBody.appendChild(row);
      });
    }
    
    // Top terms
    elements.topTermsBody.innerHTML = '';
    results.topTerms.forEach(t => {
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
   * Export results to .txt file
   */
  function exportResults() {
    if (!currentResults) {
      alert('Please run an analysis first.');
      return;
    }
    
    const r = currentResults;
    
    // Build comprehensive export content
    let content = 'ResuMatch — Analysis Results\n';
    content += '='.repeat(50) + '\n\n';
    
    // Score and note
    content += `Match Score: ${r.score}/100\n`;
    content += `Note: ${r.note}\n\n`;
    
    // Missing Keywords
    content += 'Missing Keywords\n';
    content += '-'.repeat(50) + '\n';
    if (r.missingKeywords.length > 0) {
      content += r.missingKeywords.join(', ') + '\n\n';
    } else {
      content += 'None — excellent coverage!\n\n';
    }
    
    // Hard Skills Coverage
    content += 'Hard Skills Coverage\n';
    content += '-'.repeat(50) + '\n';
    const relevantHardSkills = r.hardSkills.filter(s => s.inJD === 1 || s.inResume === 1);
    if (relevantHardSkills.length > 0) {
      content += 'Skill | In JD | In Résumé\n';
      relevantHardSkills.forEach(s => {
        content += `${s.skill} | ${s.inJD} | ${s.inResume}\n`;
      });
    } else {
      content += 'No hard skills detected\n';
    }
    content += '\n';
    
    // Soft Skills Coverage
    content += 'Soft Skills Coverage\n';
    content += '-'.repeat(50) + '\n';
    const relevantSoftSkills = r.softSkills.filter(s => s.inJD === 1 || s.inResume === 1);
    if (relevantSoftSkills.length > 0) {
      content += 'Skill | In JD | In Résumé\n';
      relevantSoftSkills.forEach(s => {
        content += `${s.skill} | ${s.inJD} | ${s.inResume}\n`;
      });
    } else {
      content += 'No soft skills detected\n';
    }
    content += '\n';
    
    // Top Terms (TF-IDF)
    content += 'Top Terms (TF-IDF)\n';
    content += '-'.repeat(50) + '\n';
    content += 'Term | JD Score | Résumé Score\n';
    r.topTerms.forEach(t => {
      content += `${t.term} | ${t.jdScore.toFixed(3)} | ${t.resumeScore.toFixed(3)}\n`;
    });
    
    // Footer
    content += '\n' + '='.repeat(50) + '\n';
    content += 'Generated by ResuMatch — Free Offline Keyword Analyzer\n';
    content += 'https://github.com/yourusername/resumatch\n';
    
    // Create and download
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
  function copyResults() {
    if (!currentResults) {
      alert('Please run an analysis first.');
      return;
    }
    
    const r = currentResults;
    
    // Build comprehensive copy content (same format as export)
    let content = 'ResuMatch — Analysis Results\n';
    content += '='.repeat(50) + '\n\n';
    
    // Score and note
    content += `Match Score: ${r.score}/100\n`;
    content += `Note: ${r.note}\n\n`;
    
    // Missing Keywords
    content += 'Missing Keywords\n';
    content += '-'.repeat(50) + '\n';
    if (r.missingKeywords.length > 0) {
      content += r.missingKeywords.join(', ') + '\n\n';
    } else {
      content += 'None — excellent coverage!\n\n';
    }
    
    // Hard Skills Coverage
    content += 'Hard Skills Coverage\n';
    content += '-'.repeat(50) + '\n';
    const relevantHardSkills = r.hardSkills.filter(s => s.inJD === 1 || s.inResume === 1);
    if (relevantHardSkills.length > 0) {
      content += 'Skill | In JD | In Résumé\n';
      relevantHardSkills.forEach(s => {
        content += `${s.skill} | ${s.inJD} | ${s.inResume}\n`;
      });
    } else {
      content += 'No hard skills detected\n';
    }
    content += '\n';
    
    // Soft Skills Coverage
    content += 'Soft Skills Coverage\n';
    content += '-'.repeat(50) + '\n';
    const relevantSoftSkills = r.softSkills.filter(s => s.inJD === 1 || s.inResume === 1);
    if (relevantSoftSkills.length > 0) {
      content += 'Skill | In JD | In Résumé\n';
      relevantSoftSkills.forEach(s => {
        content += `${s.skill} | ${s.inJD} | ${s.inResume}\n`;
      });
    } else {
      content += 'No soft skills detected\n';
    }
    content += '\n';
    
    // Top Terms (TF-IDF)
    content += 'Top Terms (TF-IDF)\n';
    content += '-'.repeat(50) + '\n';
    content += 'Term | JD Score | Résumé Score\n';
    r.topTerms.forEach(t => {
      content += `${t.term} | ${t.jdScore.toFixed(3)} | ${t.resumeScore.toFixed(3)}\n`;
    });
    
    // Footer
    content += '\n' + '='.repeat(50) + '\n';
    content += 'Generated by ResuMatch — Free Offline Keyword Analyzer\n';
    
    // Copy to clipboard
    navigator.clipboard.writeText(content).then(() => {
      const orig = elements.copyBtn.textContent;
      elements.copyBtn.textContent = 'Copied!';
      setTimeout(() => { elements.copyBtn.textContent = orig; }, 1500);
    }).catch(err => {
      console.error('Copy failed:', err);
      alert('Failed to copy to clipboard.');
    });
  }
  
  /**
   * Open side panel
   */
  function openSidePanel() {
    saveState();
    
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({ action: 'openSidePanel' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Side panel error:', chrome.runtime.lastError);
          alert('Side panel requires Chrome 114+');
        } else if (!response || !response.success) {
          alert('Failed to open side panel.');
        }
      });
    } else {
      alert('Side panel not available.');
    }
  }
  
  /**
   * Show settings help modal
   */
  function showSettingsHelp(e) {
    e.preventDefault();
    const helpText = `
SETTINGS GUIDE - Weight Sliders

The weight sliders control how important different types of keywords are when calculating your match score.

🎚️ TITLE WEIGHT (1.0x - 2.0x, Default: 1.2x)
• Boosts keywords from the Job Title field
• Increase for specialized titles: "Senior Python Developer"
• Decrease for generic titles: "Manager"
• Example: At 1.5x, title words count ~1× extra

🎚️ HARD SKILLS WEIGHT (1.0x - 3.0x, Default: 1.5x)
• Boosts technical skills & tools found in the JD
• Includes: Workday, SAP, Excel, SQL, Python, PowerBI, etc.
• Increase (2-3x) for technical roles
• Decrease (1.0-1.2x) for leadership roles
• Example: At 2.0x, "SQL" counts ~2× extra if you have it

🎚️ SOFT SKILLS WEIGHT (1.0x - 2.0x, Default: 1.0x)
• Boosts interpersonal skills found in the JD
• Includes: Leadership, Communication, Problem Solving, etc.
• Increase (1.5-2x) for management positions
• Keep at 1.0x for technical individual contributor roles

💡 HOW WEIGHTS WORK:
Higher weights = those keywords become more important
• If you HAVE the weighted skill → Score goes UP ✅
• If you're MISSING the weighted skill → Score goes DOWN ❌
• Weights only help if your résumé contains those keywords!

📊 RECOMMENDED SETTINGS:
Technical Roles: Title 1.3x, Hard 2-3x, Soft 1.0x
Management Roles: Title 1.5-2x, Hard 1.0-1.2x, Soft 1.5-2x
HR/Operations: Title 1.2x, Hard 1.5-2x, Soft 1.3-1.5x

For detailed documentation, see SETTINGS-GUIDE.md
    `.trim();
    
    alert(helpText);
  }
  
  /**
   * Attach settings help handler
   */
  function attachSettingsHelp() {
    const helpLink = document.getElementById('settingsHelp');
    if (helpLink) {
      helpLink.onclick = showSettingsHelp;
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initialize();
      attachSettingsHelp();
    });
  } else {
    initialize();
    attachSettingsHelp();
  }
  
})();

