# ⚙️ Settings Guide - Understanding the Sliders

## 🎚️ What Do The Weight Sliders Do?

The weight sliders control **how important** different types of keywords are when calculating your match score. Higher weights mean those keywords get counted more heavily in the analysis.

---

## 📊 The Three Sliders Explained

### 1️⃣ **Title Weight** (1.0x - 2.0x, Default: 1.2x)

**What it does:**  
Boosts keywords from the **Job Title** field in the analysis.

**How it works:**  
If you enter "Senior HR Manager" as the job title, words like "senior", "hr", and "manager" will be repeated in the analysis based on this weight. At 1.2x, these words are counted ~40% more (internally repeated 0.4 times more).

**When to increase it:**
- ✅ The job title contains critical keywords (e.g., "Python Developer", "Marketing Manager")
- ✅ You want to emphasize seniority level (Senior, Lead, Principal)
- ✅ The title describes a specialized role

**When to decrease it:**
- ❌ The job title is generic (e.g., "Manager")
- ❌ You didn't fill in the Job Title field
- ❌ The title doesn't match your actual role target

**Example:**
```
Job Title: "Senior Python Developer"
Weight: 1.5x

These words get boosted:
- "senior" → counted ~1× extra in the analysis
- "python" → counted ~1× extra
- "developer" → counted ~1× extra

Result: Your résumé will score higher if it contains these terms.
```

---

### 2️⃣ **Hard Skills Weight** (1.0x - 3.0x, Default: 1.5x)

**What it does:**  
Boosts **technical skills** and tools found in the job description.

**Hard skills include:**
- 🔧 Software/Tools: Workday, SAP, Excel, SQL, Python, Tableau, PowerBI
- 💼 Systems: HRIS, LMS, API, ETL, Jira, Confluence
- 📋 HR-specific: Talent Acquisition, Recruiting, Payroll, Compliance, FMLA, ADA
- 🔐 Technical: SFTP, SSO, OAuth, Webhook

**How it works:**  
When the job description mentions "Workday" or "SQL", those keywords are repeated in the analysis based on this weight. At 1.5x, they're counted ~1× extra (internally repeated 1.0 times more).

**When to increase it (2.0x - 3.0x):**
- ✅ Applying for technical/specialized roles
- ✅ Job description lists many specific tools
- ✅ You have most of the technical skills listed
- ✅ Technical skills are the main job requirement

**When to decrease it (1.0x - 1.2x):**
- ❌ Applying for leadership/management roles where soft skills matter more
- ❌ Job description is light on technical requirements
- ❌ You're missing many technical skills (lower weight won't hurt score as much)

**Example:**
```
Job Description mentions: "Experience with Workday, HRIS, and SQL"
Weight: 2.0x

These keywords get boosted:
- "workday" → counted ~2× extra
- "hris" → counted ~2× extra  
- "sql" → counted ~2× extra

Result: If your résumé mentions these tools, your score will be significantly higher.
```

---

### 3️⃣ **Soft Skills Weight** (1.0x - 2.0x, Default: 1.0x)

**What it does:**  
Boosts **interpersonal and transferable skills** found in the job description.

**Soft skills include:**
- 💬 Communication, Collaboration, Customer Service
- 👔 Leadership, Management, Mentorship
- 🧠 Problem Solving, Critical Thinking, Analytical
- ⏰ Time Management, Attention to Detail
- 🤝 Stakeholder Management, Teamwork
- 🔄 Adaptability, Conflict Resolution, Strategic Thinking

**How it works:**  
When the job description mentions "leadership" or "communication", those keywords are repeated based on this weight. At 1.0x, they're counted normally (no boost).

**When to increase it (1.3x - 2.0x):**
- ✅ Applying for leadership/management positions
- ✅ Job emphasizes "soft skills" heavily
- ✅ Role requires stakeholder management, team leadership
- ✅ Your strengths are in interpersonal skills

**When to keep at 1.0x:**
- ✅ Default for most roles
- ✅ Technical roles where hard skills dominate
- ✅ Individual contributor positions

**Example:**
```
Job Description mentions: "Strong leadership and communication skills required"
Weight: 1.5x

These keywords get boosted:
- "leadership" → counted ~1× extra
- "communication" → counted ~1× extra

Result: Your résumé will score higher if it emphasizes these interpersonal skills.
```

---

## 🎯 How Weights Affect Your Score

### The Algorithm:

1. **Tokenization:** Text is broken into words and normalized
2. **Weighting:** Keywords are repeated based on slider values
   - Title words repeated: `(weight - 1.0) × 2` times
   - Hard skill words repeated: `(weight - 1.0) × 2` times
   - Soft skill words repeated: `(weight - 1.0) × 2` times
3. **TF-IDF Calculation:** Repeated words have higher term frequency (TF)
4. **Cosine Similarity:** Compares weighted JD vector to résumé vector
5. **Final Score:** Similarity × 100 (clamped to 0-100)

### Example Calculation:

```
Job Description: "Seeking Python developer with leadership skills"

Scenario A: All weights at 1.0x
- "python" counted 1 time
- "developer" counted 1 time
- "leadership" counted 1 time
Score: 65/100

Scenario B: Hard Skills at 2.0x, Soft Skills at 1.5x
- "python" counted 3 times (1 + 2× boost)
- "developer" counted 1 time
- "leadership" counted 2 times (1 + 1× boost)
Score: 72/100 (if résumé has these words)

Result: +7 points by emphasizing the skills you have!
```

---

## 💡 Recommended Settings by Role Type

### 🔧 **Technical Roles** (Developer, Engineer, Data Analyst)
```
Title Weight: 1.3x - 1.5x
Hard Skills Weight: 2.0x - 3.0x  ← High emphasis on tools
Soft Skills Weight: 1.0x
```
**Why:** Technical skills are the primary requirement

---

### 👔 **Management/Leadership Roles** (Manager, Director, VP)
```
Title Weight: 1.5x - 2.0x  ← Emphasize seniority
Hard Skills Weight: 1.0x - 1.2x
Soft Skills Weight: 1.5x - 2.0x  ← High emphasis on interpersonal
```
**Why:** Leadership and people skills are critical

---

### 💼 **HR/Operations Roles** (HR Manager, Operations Coordinator)
```
Title Weight: 1.2x
Hard Skills Weight: 1.5x - 2.0x  ← Systems like Workday, HRIS
Soft Skills Weight: 1.3x - 1.5x  ← Communication matters
```
**Why:** Balance of systems knowledge and people skills

---

### 🎨 **Creative Roles** (Designer, Writer, Marketing)
```
Title Weight: 1.2x
Hard Skills Weight: 1.5x - 2.0x  ← Tools like Adobe, Figma
Soft Skills Weight: 1.2x - 1.5x
```
**Why:** Tools matter, but creativity and collaboration too

---

### 🎓 **Entry-Level Roles**
```
Title Weight: 1.0x - 1.2x
Hard Skills Weight: 1.2x - 1.5x
Soft Skills Weight: 1.3x - 1.5x  ← Emphasize potential
```
**Why:** Less emphasis on specific experience, more on capability

---

## 🧪 Experimentation Tips

### Test Different Settings:

1. **Start with defaults** (1.2x, 1.5x, 1.0x)
2. **Run analysis** and note your score
3. **Adjust one slider** at a time
4. **Run again** to see the difference
5. **Find your optimal settings** for this job type

### What to Expect:

- **+2-5 points:** Small weight increase (0.2x)
- **+5-10 points:** Moderate weight increase (0.5x)
- **+10-15 points:** Large weight increase (1.0x+)

**Note:** Weights only help if your résumé *contains* those keywords. If you don't mention "Python", increasing Hard Skills weight won't help.

---

## ❓ Common Questions

### Q: Should I max out all sliders to get a higher score?
**A:** No! High weights only help if you *have* those skills. If you're missing hard skills, a high weight will actually make your score *worse* by emphasizing the gap.

### Q: Why is my score going DOWN when I increase weights?
**A:** The weight is applied to the *job description*, making those keywords more important. If your résumé doesn't have those weighted keywords, the gap becomes more apparent, lowering your score.

### Q: What's the "right" setting?
**A:** It depends on the role and your background. Use the recommended settings above as a starting point, then adjust based on what the job emphasizes.

### Q: Do weights affect "Missing Keywords"?
**A:** No. Missing keywords are calculated separately. Weights only affect the match score calculation.

### Q: Can I save my settings?
**A:** Yes! Settings are automatically saved to localStorage and restored when you reopen the extension.

---

## 🎯 Quick Reference Card

| Slider | Default | When to Increase | When to Decrease |
|--------|---------|------------------|------------------|
| **Title** | 1.2x | Specialized/senior titles | Generic titles |
| **Hard Skills** | 1.5x | Technical roles | Leadership roles |
| **Soft Skills** | 1.0x | Management roles | Technical roles |

---

## 📊 Visual Example

```
Job Description mentions:
- "Python" (hard skill) 
- "Leadership" (soft skill)

Settings:
Title: 1.2x
Hard Skills: 2.0x
Soft Skills: 1.0x

Internal Processing:
- "Python" gets counted 3× (boosted by hard skills weight)
- "Leadership" gets counted 1× (no boost from soft skills)

Your Résumé mentions:
- "Python" → Big score boost! (3× weight)
- "Leadership" → Normal score boost (1× weight)

Result: High match score because you have the heavily-weighted skill (Python)
```

---

## 🚀 Pro Tips

1. **Match the job's emphasis:** If JD lists 10 tools and 2 soft skills, increase Hard Skills weight
2. **Highlight your strengths:** Have great leadership experience? Increase Soft Skills weight
3. **Use the "Missing Keywords" section:** This shows what you're missing regardless of weights
4. **Don't over-optimize:** Weights of 2.5x+ can skew results. Stay reasonable.
5. **Test multiple configurations:** Save your best scores for comparison

---

**Remember:** Weights are a tool to help the analysis reflect the job's true priorities. Use them to emphasize what matters most for each specific role! 🎯

