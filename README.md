# JobScan Lite — Offline Keyword Match

Production-ready Chrome extension for comparing job descriptions and résumés with TF-IDF analysis, completely offline.

## 🚀 Quick Start

### Installation

1. **Open Chrome Extensions:**
   ```
   chrome://extensions/
   ```

2. **Enable Developer Mode:**
   - Toggle the switch in the top right corner

3. **Load the Extension:**
   - Click "Load unpacked"
   - Select the `jobscan-lite` folder
   - The extension should appear in your toolbar

4. **Reload (IMPORTANT):**
   - After loading, click the **reload icon** 🔄 on the extension card
   - This ensures all scripts load properly

### First Use

1. **Click the extension icon** in your toolbar
2. **Check the Console** (right-click → Inspect → Console tab)
3. You should see:
   ```
   🚀 JobScan Lite initializing...
   ✅ Utilities loaded
   ✅ All DOM elements found
   ✅ Event listeners attached
   ✅ JobScan Lite ready!
   ```

4. **Test the interface:**
   - Move a slider → should see value change (e.g., "1.3x")
   - Click a button → should see console log

If you don't see these messages, follow the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) guide.

## 📝 How to Use

### Basic Analysis

1. **Paste your job description** in the "Job Description" field
2. **Paste your résumé** in the "Résumé" field
3. *Optional:* Add the job title in the "Job Title" field
4. **Click "Analyze"**

### Understanding Results

- **Match Score (0-100):** Overall alignment with job description
  - 85-100: Excellent match
  - 70-84: Strong match
  - 55-69: Decent match
  - 0-54: Low match

- **Missing Keywords:** Terms in JD but not in résumé
  - **Red tags** = Critical keywords (focus on these!)
  - Normal tags = Less critical

- **Skills Coverage:** Shows which hard/soft skills are present
  - 1 = Present
  - 0 = Missing

- **Top Terms:** Most important terms by TF-IDF analysis

### Adjusting Settings

**Weight Sliders:**
- **Title Weight (1.0-2.0):** Boost importance of job title keywords
- **Hard Skills (1.0-3.0):** Technical skills, tools, certifications
- **Soft Skills (1.0-2.0):** Interpersonal skills, leadership, etc.

**Stopwords Checkbox:**
- Removes common words like "the", "and", "is"
- Usually keep this checked

### Actions

- **Analyze:** Run the analysis
- **Clear:** Clear all fields and hide results
- **Export (.txt):** Download results as a text file
- **Copy:** Copy results to clipboard
- **📌 Pin to Side:** Open in side panel (stays open while browsing)

## 🎯 Features

### 100% Offline
- No internet required
- No external API calls
- Complete privacy

### Persistent Data
- Automatically saves your inputs
- Reopening restores your data
- Works in both popup and side panel

### Side Panel Mode
- Stays open while browsing
- Perfect for working across multiple tabs
- Access via "📌 Pin to Side" button

## 🔧 Troubleshooting

### Buttons Not Working

1. **Open DevTools:** Right-click → Inspect → Console
2. **Look for initialization messages** (see Quick Start above)
3. **Check for errors** (red text in console)

Common fixes:
- **Reload the extension** in `chrome://extensions/`
- **Close and reopen** the popup
- Follow detailed steps in [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Sliders Not Updating

1. **Open Console** and move a slider
2. You should see: `Title weight slider moved: 1.3`
3. If not, reload the extension

### Side Panel Not Working

- **Requires Chrome 114+**
- Check version: `chrome://settings/help`
- Try regular popup first

## 📂 File Structure

```
jobscan-lite/
├── manifest.json          # Extension configuration
├── popup.html            # UI layout
├── popup.js              # Main application logic
├── background.js         # Service worker for side panel
├── styles.css            # Dark theme styling
├── utils/
│   ├── text.js          # Text processing & NLP
│   └── tfidf.js         # TF-IDF calculations
├── icons/               # Extension icons
├── README.md            # This file
├── USAGE.md             # Detailed usage guide
└── TROUBLESHOOTING.md   # Debug guide
```

## 🎨 Technical Details

### NLP Pipeline

1. **Normalization:** Lowercase, clean punctuation
2. **Tokenization:** Split into words
3. **Stopword Removal:** Remove common words (optional)
4. **Light Stemming:** Reduce to base forms (e.g., "recruiting" → "recruit")
5. **TF-IDF Calculation:** Term frequency × Inverse document frequency
6. **Cosine Similarity:** Calculate angle between vectors

### Weighting System

Keywords are boosted before TF calculation:
- Job title terms repeated ~0.4× (from 1.2× weight)
- Hard skills repeated ~1.0× (from 1.5× weight)
- Soft skills repeated 0× (from 1.0× weight)

### Skills Dictionaries

**Hard Skills (39):**
workday, hcm, lms, sap, oracle, excel, sql, python, javascript, react, api, etl, tableau, powerbi, jira, confluence, notion, zapier, make, airtable, talent acquisition, recruiting, compensation, benefits, union, mou, loa, payroll, compliance, ofla, fmla, ada, overtime, hris, sftp, sso, oauth, webhook, kafka

**Soft Skills (15):**
communication, collaboration, leadership, problem solving, critical thinking, time management, attention to detail, stakeholder management, customer service, adaptability, conflict resolution, teamwork, mentorship, analytical, strategic

## 🔒 Privacy & Security

- **Zero network requests** — verify in DevTools Network tab
- **No permissions** required beyond basic extension access
- **LocalStorage only** — data never leaves your browser
- **No tracking or analytics**

## 📊 Tips for Best Results

1. **Use complete text** — don't truncate job descriptions
2. **Include full résumé** — more text = better analysis
3. **Add job title** — helps weight important terms
4. **Review critical keywords** — these are most important to add
5. **Adjust weights** — increase hard skills for technical roles
6. **Use side panel** — keeps extension open while working

## 🐛 Known Limitations

- **English only** — optimized for English text
- **No semantic understanding** — keyword matching only
- **Simple stemming** — not as sophisticated as paid tools
- **No context** — doesn't understand sentence meaning

## 📦 Distribution

Ready for Chrome Web Store:

```bash
zip -r jobscan-lite.zip jobscan-lite/ -x "*.DS_Store" "*/test-*"
```

## 🎯 Version

**Version:** 1.0.0  
**Manifest:** V3  
**Min Chrome:** 114 (for side panel)

## 📄 License

Free to use and distribute. No warranty provided.

---

Built for job seekers who value privacy and want a free alternative to paid ATS scanners. Good luck with your applications! 🚀

