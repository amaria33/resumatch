# JobScan Lite — Usage Guide

## 🎯 Two Ways to Use the Extension

### Option 1: Quick Popup (Default)
- Click the extension icon in your toolbar
- The popup opens for quick analysis
- **Note:** The popup closes when you click away (standard browser behavior)
- Your data is automatically saved and restored when you reopen it

### Option 2: Side Panel (Persistent View) ⭐ NEW!
- Click the **"📌 Pin to Side"** button in the popup
- The extension opens in Chrome's side panel
- **Stays open while you browse** other tabs and pages
- Perfect for keeping the extension visible while you:
  - Copy/paste from multiple sources
  - Navigate between job postings
  - Reference your results while editing your résumé

## 🚀 How to Enable Side Panel

1. **Reload the extension** after installation:
   - Go to `chrome://extensions/`
   - Find "JobScan Lite"
   - Click the reload icon 🔄

2. **Use the Pin to Side button**:
   - Open the extension popup
   - Click "📌 Pin to Side"
   - The side panel opens on the right side of your browser

3. **Access side panel anytime**:
   - Right-click the extension icon
   - Select "Open in side panel"
   
   OR
   
   - Use Chrome's side panel menu (≡) in the toolbar

## 💡 Features

### Persistent Data
- All your inputs are automatically saved to localStorage
- Close and reopen the extension — your data is still there
- Works in both popup and side panel views

### Analysis Options
- **Job Title** (optional): Boosts matching for title keywords
- **Weight Sliders**: Adjust importance of title, hard skills, and soft skills
- **Stopwords Toggle**: Remove common words like "the", "and", "is"

### Results
- **Match Score** (0-100): Overall alignment with job description
- **Missing Keywords**: Terms in JD but not in your résumé
  - Critical keywords highlighted in red
- **Skills Coverage**: Hard and soft skills comparison tables
- **Top Terms**: TF-IDF analysis of most important terms

### Export Options
- **Export (.txt)**: Download results as a text file
- **Copy**: Copy results to clipboard for pasting elsewhere

## ⚙️ Requirements

- Chrome 114 or later (for side panel feature)
- No internet connection required — 100% offline!
- No special permissions needed

## 🔒 Privacy

- All processing happens locally in your browser
- No data is ever sent to external servers
- No tracking or analytics
- Your job applications stay private

## 🐛 Troubleshooting

### "Could not open side panel" error
- Make sure you're running Chrome 114 or later
- Check that the extension is properly loaded
- Try reloading the extension

### Popup closes unexpectedly
- This is normal browser behavior for extension popups
- Use the "📌 Pin to Side" button for persistent access

### Data not saved
- Check that your browser allows localStorage
- Make sure you're not in Incognito mode (or enable extension in Incognito)

### Analysis not working
- Open DevTools (F12) and check the Console tab for errors
- Make sure both Job Description and Résumé fields have text
- Try reloading the extension

## 📊 Score Interpretation

- **85-100**: Excellent match — highly aligned
- **70-84**: Strong match — add missing keywords for boost
- **55-69**: Decent match — consider tailoring achievements
- **0-54**: Low match — customize résumé for this role

## 🎨 Tips for Best Results

1. **Paste complete job descriptions** — more text = better analysis
2. **Include your full résumé** — don't just paste summaries
3. **Adjust weights** based on job type:
   - Technical roles: Increase hard skills weight
   - Management roles: Increase soft skills weight
4. **Review missing keywords** — add relevant ones to your résumé
5. **Focus on critical keywords** (shown in red) — these are most important
6. **Use the side panel** when working on multiple applications

---

Made with ❤️ for job seekers everywhere. Good luck with your applications!

