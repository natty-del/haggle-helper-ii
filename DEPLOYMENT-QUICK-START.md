# 🚀 PHASE 1 - QUICK DEPLOYMENT CHECKLIST

## 5-Minute Setup

### Prerequisites
- GitHub account
- Vercel account (free)
- Anthropic API key from https://console.anthropic.com

---

## ✅ Deployment Steps

### 1️⃣ GitHub Setup (2 min)
```bash
# Create new repository on GitHub
# https://github.com/new

# Clone it locally
git clone https://github.com/YOUR_USERNAME/hagglehelper.git
cd hagglehelper

# Add files
cp /path/to/hagglehelper-phase1.html index.html
cp /path/to/api-analyze.js api/analyze.js
cp /path/to/manifest.json manifest.json
cp /path/to/PHASE1-README.md README.md

# Commit and push
git add .
git commit -m "Phase 1: Core Scanning - Photo upload with AI analysis"
git push origin main
```

### 2️⃣ Vercel Deployment (2 min)
1. Go to https://vercel.com
2. Click **"New Project"**
3. **Import from GitHub** → Select `hagglehelper` repo
4. Leave settings default
5. Click **"Deploy"**

*It will fail - that's OK, we need to add the API key.*

### 3️⃣ Add API Key (1 min)
1. In Vercel dashboard, go to your project
2. Click **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: Paste your API key from https://console.anthropic.com
4. Click **Save**
5. Click **Deployments** → **Redeploy** → **Redeploy** again

### 4️⃣ Test the Live App (Final Step)
- Visit: `https://hagglehelper-YOUR_USERNAME.vercel.app`
- Upload a photo
- Should see loading screen → results
- Try submitting a price

---

## 🎯 Expected Results

### Photo Upload Works ✓
- Camera/gallery access on mobile
- Drag-and-drop on desktop
- Preview shows image

### AI Analysis Works ✓
- Fullscreen loading screen appears
- After 5-15 seconds: Results shown
- Shows item, price range, tips, confidence

### Firebase Saves Data ✓
- Click "What did you pay?" button
- Enter price + location
- Submit → "Price saved" message
- Check Firebase Console to see data

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "❌ API error: 401" | Check API key is set in Vercel env vars |
| App loads but no API button | API key not configured |
| "Analysis Failed" error | API key invalid or network issue |
| Photo not showing in background | localStorage disabled - enable it |
| Modal won't close | Clear browser cache, try again |

---

## 📊 What's Actually Happening

1. **User uploads photo** → Browser compresses to base64
2. **JavaScript sends to** `/api/analyze`
3. **Vercel function receives request** → Calls Claude API
4. **Claude analyzes image** → Identifies item + estimates price
5. **Response returns** → JavaScript displays results
6. **User submits price** → Saves to Firebase Firestore

---

## 💾 File Structure After Setup

```
hagglehelper/
├── index.html              ← Main PWA (was hagglehelper-phase1.html)
├── manifest.json           ← PWA config
├── api/
│   └── analyze.js          ← Serverless function
├── README.md               ← Phase 1 docs
├── .git/                   ← Git history
└── .vercelignore           ← (optional)
```

---

## 🔗 Important Links

- **Your Vercel Project**: https://vercel.com/dashboard/projects
- **Claude API Console**: https://console.anthropic.com
- **Firebase Console**: https://console.firebase.google.com
- **Live App**: https://hagglehelper-YOUR_USERNAME.vercel.app

---

## ✨ Next: Phase 2 Preview

After Phase 1 is live and working:
- Add Firebase query for leaderboard
- Display top hagglers by savings %
- Fake placeholder leaders (until real data)
- Scan history view

---

## 🎉 YOU'RE DONE!

Your app is now live and collecting data. 

**Test it** → Take a photo of a price tag anywhere in Vietnam → See the magic happen! ✨

---

## 📝 Notes

- **Free tier**: Vercel + Firebase cover all costs for early testing
- **Scalability**: If it works great, we'll optimize in Phase 2
- **Data**: Every scan goes to Firebase, building a dataset for future ML models
- **Offline**: App shows last photo but can't analyze without internet

---

**Questions? Check PHASE1-README.md for detailed docs.**
