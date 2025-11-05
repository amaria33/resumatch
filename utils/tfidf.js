/**
 * tfidf.js - TF-IDF computation and cosine similarity
 * Implements term frequency, inverse document frequency, and vector similarity
 */

/**
 * Calculate term frequency with L2 normalization
 * TF = count / sqrt(sum of all counts squared)
 * @param {string[]} tokens - Array of tokens
 * @returns {Map<string, number>} - Map of term to normalized frequency
 */
function termFreq(tokens) {
  const tf = new Map();
  
  // Count occurrences
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }
  
  // L2 normalization: divide by vector magnitude
  let sumSquares = 0;
  for (const count of tf.values()) {
    sumSquares += count * count;
  }
  const magnitude = Math.sqrt(sumSquares);
  
  if (magnitude > 0) {
    for (const [term, count] of tf.entries()) {
      tf.set(term, count / magnitude);
    }
  }
  
  return tf;
}

/**
 * Calculate inverse document frequency with smoothing
 * IDF = log((N + 1) / (df + 1)) + 1
 * where N = number of documents, df = number of documents containing term
 * @param {Set<string>[]} docSets - Array of Sets, each containing unique terms from a document
 * @returns {Map<string, number>} - Map of term to IDF value
 */
function idf(docSets) {
  const idfMap = new Map();
  const N = docSets.length;
  
  // Collect all unique terms
  const allTerms = new Set();
  for (const docSet of docSets) {
    for (const term of docSet) {
      allTerms.add(term);
    }
  }
  
  // Calculate IDF for each term
  for (const term of allTerms) {
    // Count how many documents contain this term
    let df = 0;
    for (const docSet of docSets) {
      if (docSet.has(term)) {
        df++;
      }
    }
    
    // Smoothed IDF formula
    const idfValue = Math.log((N + 1) / (df + 1)) + 1;
    idfMap.set(term, idfValue);
  }
  
  return idfMap;
}

/**
 * Calculate TF-IDF by multiplying TF and IDF
 * @param {Map<string, number>} tfMap - Term frequency map
 * @param {Map<string, number>} idfMap - IDF map
 * @returns {Map<string, number>} - TF-IDF scores
 */
function tfidf(tfMap, idfMap) {
  const tfidfMap = new Map();
  
  for (const [term, tfValue] of tfMap.entries()) {
    const idfValue = idfMap.get(term) || 1;
    tfidfMap.set(term, tfValue * idfValue);
  }
  
  return tfidfMap;
}

/**
 * Calculate cosine similarity between two TF-IDF vectors
 * Cosine similarity = dot product / (magnitude_A * magnitude_B)
 * @param {Map<string, number>} vecA - First TF-IDF vector
 * @param {Map<string, number>} vecB - Second TF-IDF vector
 * @returns {number} - Similarity score between 0 and 1
 */
function cosineSim(vecA, vecB) {
  // Calculate dot product
  let dotProduct = 0;
  for (const [term, valueA] of vecA.entries()) {
    const valueB = vecB.get(term);
    if (valueB !== undefined) {
      dotProduct += valueA * valueB;
    }
  }
  
  // Calculate magnitudes
  let magA = 0;
  for (const value of vecA.values()) {
    magA += value * value;
  }
  magA = Math.sqrt(magA);
  
  let magB = 0;
  for (const value of vecB.values()) {
    magB += value * value;
  }
  magB = Math.sqrt(magB);
  
  // Avoid division by zero
  if (magA === 0 || magB === 0) {
    return 0;
  }
  
  return dotProduct / (magA * magB);
}

// Export all functions
window.TFIDFUtils = {
  termFreq,
  idf,
  tfidf,
  cosineSim
};

