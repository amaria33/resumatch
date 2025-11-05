/**
 * text.js - Text normalization, tokenization, stopwords, and skills dictionaries
 * All processing is done client-side with no external dependencies
 */

// Comprehensive English stopwords set
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 
  'by', 'can', 'did', 'do', 'does', 'doing', 'don', 'down', 'during', 'each', 'few', 'for', 
  'from', 'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 
  'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 
  'me', 'might', 'more', 'most', 'must', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 
  'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 's', 
  'same', 'she', 'should', 'so', 'some', 'such', 't', 'than', 'that', 'the', 'their', 'theirs', 
  'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 
  'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 
  'while', 'who', 'whom', 'why', 'will', 'with', 'would', 'you', 'your', 'yours', 'yourself', 
  'yourselves'
]);

// Hard skills dictionary - technical tools, systems, and specific competencies
const HARD_SKILLS = [
  "workday", "hcm", "lms", "sap", "oracle", "excel", "sql", "python", "javascript", "react", 
  "api", "etl", "tableau", "powerbi", "jira", "confluence", "notion", "zapier", "make", 
  "airtable", "talent acquisition", "recruiting", "compensation", "benefits", "union", "mou", 
  "loa", "payroll", "compliance", "ofla", "fmla", "ada", "overtime", "hris", "sftp", "sso", 
  "oauth", "webhook", "kafka"
];

// Soft skills dictionary - interpersonal and transferable skills
const SOFT_SKILLS = [
  "communication", "collaboration", "leadership", "problem solving", "critical thinking", 
  "time management", "attention to detail", "stakeholder management", "customer service", 
  "adaptability", "conflict resolution", "teamwork", "mentorship", "analytical", "strategic"
];

/**
 * Light stemming function - removes common suffixes while preserving acronyms
 * @param {string} word - The word to stem
 * @returns {string} - Stemmed word
 */
function stemLite(word) {
  // Preserve very short words and likely acronyms (all uppercase or mixed case with no vowels)
  if (word.length <= 3) return word;
  
  // Don't stem if it looks like an acronym (HR, API, etc.)
  const isAcronym = word.toUpperCase() === word && word.length <= 5;
  if (isAcronym) return word;
  
  // Remove common suffixes in order of specificity
  // Plural ies -> y
  if (word.endsWith('ies') && word.length > 4) {
    return word.slice(0, -3) + 'y';
  }
  // -ing
  if (word.endsWith('ing') && word.length > 5) {
    return word.slice(0, -3);
  }
  // -ed
  if (word.endsWith('ed') && word.length > 4) {
    return word.slice(0, -2);
  }
  // -ers
  if (word.endsWith('ers') && word.length > 5) {
    return word.slice(0, -3);
  }
  // -er
  if (word.endsWith('er') && word.length > 4) {
    return word.slice(0, -2);
  }
  // -ly
  if (word.endsWith('ly') && word.length > 4) {
    return word.slice(0, -2);
  }
  // -s (simple plural)
  if (word.endsWith('s') && word.length > 3 && !word.endsWith('ss')) {
    return word.slice(0, -1);
  }
  
  return word;
}

/**
 * Normalize text: lowercase, remove non-alphanumeric except specific chars, collapse whitespace
 * @param {string} text - Raw input text
 * @returns {string} - Normalized text
 */
function normalize(text) {
  if (!text) return '';
  
  // Lowercase
  let normalized = text.toLowerCase();
  
  // Replace anything NOT [a-z0-9 +\-#.] with space
  // This preserves common tech notation like C++, C#, .NET, etc.
  normalized = normalized.replace(/[^a-z0-9 +\-#.]/g, ' ');
  
  // Collapse multiple spaces to single space
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  return normalized;
}

/**
 * Tokenize text into array of stemmed words
 * @param {string} text - Text to tokenize
 * @param {boolean} useStopwords - Whether to remove stopwords (default: true)
 * @returns {string[]} - Array of tokens
 */
function tokenize(text, useStopwords = true) {
  const normalized = normalize(text);
  const words = normalized.split(' ').filter(w => w.length > 0);
  
  let tokens = words;
  
  // Remove stopwords if enabled
  if (useStopwords) {
    tokens = tokens.filter(word => !STOPWORDS.has(word));
  }
  
  // Apply light stemming
  tokens = tokens.map(word => stemLite(word));
  
  // Filter out very short tokens (1 char) after stemming unless they're meaningful
  tokens = tokens.filter(token => token.length > 1);
  
  return tokens;
}

/**
 * Extract n-gram phrases (1-3 words) from text for phrase matching
 * Used to check if multi-word skills like "talent acquisition" are present
 * @param {string} text - Input text
 * @returns {Set<string>} - Set of normalized phrases
 */
function extractPhrases(text) {
  const normalized = normalize(text);
  const words = normalized.split(' ').filter(w => w.length > 0);
  const phrases = new Set();
  
  // Add individual words (1-grams)
  for (let i = 0; i < words.length; i++) {
    phrases.add(words[i]);
  }
  
  // Add 2-grams
  for (let i = 0; i < words.length - 1; i++) {
    phrases.add(`${words[i]} ${words[i + 1]}`);
  }
  
  // Add 3-grams
  for (let i = 0; i < words.length - 2; i++) {
    phrases.add(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
  }
  
  return phrases;
}

// Export all functions and data
window.TextUtils = {
  STOPWORDS,
  HARD_SKILLS,
  SOFT_SKILLS,
  normalize,
  tokenize,
  extractPhrases,
  stemLite
};

