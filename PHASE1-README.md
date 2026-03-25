# HaggleHelper Phase 1: Core Scanning - Implementation Guide

## 📋 What's Included

### Files
1. **hagglehelper-phase1.html** - Complete single-file PWA with all styling and JavaScript
2. **api/analyze.js** - Vercel serverless function for Claude API integration
3. **manifest.json** - PWA configuration
4. **Phase1-README.md** - This file

### Features Implemented
✅ Mobile-first dark theme with orange accent (#ff6b35)
✅ Photo background system with blur effect (visible through translucent cards)
✅ Photo upload with drag-and-drop support
✅ AI price analysis via Claude API (with web_search tool capability)
✅ Haggling tips generation
✅ Fullscreen loading screen with progress messages
✅ Price submission modal with Firebase Firestore integration
✅ Responsive design for all device sizes
✅ PWA-ready (manifest, service worker hooks)

---

## 🚀 Local Testing

### Prerequisites
- Node.js 18+ (optional, for local server)
- Modern browser with ES6+ support
- Firebase project configured (credentials embedded in code)

### Quick Start - No Server Needed
1. Open `hagglehelper-phase1.html` directly in your browser
2. **LIMITATION**: API calls will fail due to CORS (cross-origin)
3. Use Vercel for full functionality

### Testing with Local Server
```bash
# Using Python
python -m http.server 8000

# Or using Node with http-server
npx http-server

# Then visit: http://localhost:8000
```

### API Testing Without Firebase
The HTML file will still load and display the UI. Firebase integration is optional for Phase 1.

---

## 🔧 Deployment to Vercel

### Step 1: Create GitHub Repository
```bash
git init
git add .
git commit -m "Phase 1: Core Scanning"
git remote add origin https://github.com/YOUR_USERNAME/hagglehelper.git
git push -u origin main
```

### Step 2: Connect to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Select project root as `/`

### Step 3: Configure Environment Variables
In Vercel Dashboard:
1. Go to Settings > Environment Variables
2. Add: `ANTHROPIC_API_KEY` = (your Anthropic API key)
3. Save and redeploy

### Step 4: Deploy API Function
Vercel automatically deploys `api/analyze.js` as a serverless function.
The function will be available at: `https://your-domain.vercel.app/api/analyze`

### Step 5: Update HTML File Path (if needed)
In the HTML file, the API call uses:
```javascript
const response = await fetch('/api/analyze', {
```
This works automatically on Vercel.

---

## 📸 Testing the Photo Upload Flow

### Manual Testing Steps

1. **Upload Photo**
   - Click the upload zone (or drag-and-drop)
   - Select any price tag photo
   - Photo should appear in preview
   - Background should blur with the photo

2. **Analyze**
   - Loading screen appears with hourglass and message
   - Screen shows "Analyzing photo..."
   - Results appear in 5-15 seconds

3. **View Results**
   - Item name, description
   - Fair price range (min-max VND)
   - Confidence badge (high/medium/low)
   - 3-4 haggling tips

4. **Submit Price**
   - Click "What did you pay? 💰" button
   - Modal opens
   - Enter actual price paid
   - Enter location (optional)
   - Click Submit
   - Data saves to Firebase Firestore

---

## 🔌 API Function Behavior

### Image Analysis Request
```javascript
POST /api/analyze
{
  "image": "base64_image_data",
  "location": "Hanoi"
}
```

### Response
```json
{
  "item": "Bananas",
  "description": "Ripe bananas, 1kg bunch",
  "estimatedPrice": {
    "min": 15000,
    "max": 25000,
    "currency": "VND"
  },
  "confidence": "high",
  "hagglingTips": [
    "Check neighboring stalls",
    "Buy in bulk for better rates",
    "Morning prices are often better"
  ],
  "context": "Local market pricing in Hanoi",
  "localInsights": "Bananas are in season, prices should be low"
}
```

### Error Handling
If API fails:
- User sees: "❌ Analysis Failed"
- Message explains what went wrong
- "Try Again" button to retry

---

## 🧪 Testing Checklist

### UI/UX Tests
- [ ] Photo upload works on mobile (camera + gallery)
- [ ] Drag-and-drop works on desktop
- [ ] Photo preview displays correctly
- [ ] Background photo is visible through translucent cards
- [ ] Loading screen is impossible to miss
- [ ] Results display with proper formatting
- [ ] Modal opens/closes correctly
- [ ] Responsive on: iPhone 12, iPad, desktop

### Functionality Tests
- [ ] Photo uploaded → API call triggers
- [ ] Results display within 15 seconds
- [ ] Price submission saves to Firebase
- [ ] User ID generated and persists
- [ ] Last photo saved to localStorage
- [ ] Background photo reloads on page refresh
- [ ] Error states display helpful messages

### API Tests
- [ ] POST /api/analyze works with image
- [ ] Returns valid JSON response
- [ ] Confidence level set correctly
- [ ] Price range includes min and max
- [ ] Haggling tips provided (3-4 items)
- [ ] Error messages are user-friendly
- [ ] API timeout after 30 seconds

### Firebase Tests
- [ ] price_submissions collection created
- [ ] Document structure matches schema
- [ ] Timestamps recorded correctly
- [ ] User ID persists across sessions
- [ ] Price calculations correct

---

## 🐛 Troubleshooting

### "❌ API error: 401"
**Cause**: ANTHROPIC_API_KEY not set in Vercel environment variables
**Fix**: 
1. Go to Vercel project settings
2. Add ANTHROPIC_API_KEY environment variable
3. Redeploy

### "❌ Analysis Failed - Could not analyze image"
**Cause**: Claude API request failed
**Possible reasons**:
- Invalid base64 image data
- Image too large
- Claude API temporarily down
**Fix**: Try with a clearer, smaller image

### Firebase not saving data
**Cause**: Firebase SDK not initialized
**Check**:
1. Verify firebaseConfig in HTML matches project
2. Ensure Firestore rules allow write access
3. Check browser console for Firebase errors

### Photo background not showing
**Cause**: localStorage not working or photo not saved
**Fix**:
1. Enable localStorage in browser settings
2. Re-upload a photo
3. Refresh page

---

## 📊 Expected API Costs (Rough Estimates)

### Claude API (vision + text)
- ~$0.003 per image analysis (Sonnet 4)
- Haggling tips included in same request

### Firebase Firestore
- Write: 1 document per submission (~$0.06 per 100k writes)
- Read: Minimal in Phase 1
- **Free tier**: 50k reads/day, 20k writes/day

### Vercel
- **Free tier**: Sufficient for early testing

---

## 📝 Next Steps (Phase 2)

After confirming Phase 1 works:
1. Firebase Firestore query for leaderboard
2. Basic rankings by savings %
3. Placeholder fake leaders (until real data builds)
4. Scan history view

---

## 🎨 Design Details

### Colors
- Background: #0a1628 (very dark blue)
- Cards: #1e3a5f @ 38% opacity (translucent)
- Accent: #ff6b35 (orange)
- Text: #ffffff (white)
- Secondary: #a0b0c0 (light gray)

### Typography
- Display: Rubik (Google Fonts)
- Monospace: Space Mono (prices, numbers)

### Effects
- Backdrop blur: 20px on cards
- Photo blur: 20px on background
- Transitions: 200-300ms ease-out
- Card opacity: 38% (photo visible)

---

## 📱 Mobile Considerations

### Viewport Meta Tag
Already included for proper mobile scaling

### Touch Targets
- Buttons: 44px minimum height (accessibility standard)
- Upload zone: Large tap target

### Performance
- No large dependencies
- Single HTML file (~8KB gzipped)
- Image compression before upload (max 800px)
- Firebase SDK loaded from CDN

---

## 🔑 Important Credentials

### Firebase Config (Public - OK in code)
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDyBTN9pN-Ru9QFbzo2DRlqjXgxwSBfk1M",
  authDomain: "hagglehelper-b6fc2.firebaseapp.com",
  projectId: "hagglehelper-b6fc2",
  storageBucket: "hagglehelper-b6fc2.firebasestorage.app",
  messagingSenderId: "15166675869",
  appId: "1:15166675869:web:c96ef2f92c3c94adb6ba54"
};
```

### Anthropic API Key (NEVER in client code)
- Set in Vercel environment variables only
- Accessed via serverless function
- Used by Claude Sonnet 4 model

---

## 📚 File Organization

```
hagglehelper/
├── index.html              (or hagglehelper-phase1.html - rename to index.html for Vercel)
├── api/
│   └── analyze.js         (Vercel serverless function)
├── manifest.json          (PWA config)
└── vercel.json            (optional - for Vercel config)
```

### Vercel Deployment Structure
```
/
├── index.html
├── manifest.json
├── api/
│   └── analyze.js
```

---

## ✅ Success Criteria for Phase 1

The implementation is complete when:

✅ User can upload photo (camera or gallery)
✅ AI analyzes image and returns item + price estimate in <10 seconds
✅ Results display with confidence, tips, and price range
✅ User can submit actual price paid
✅ Data saves to Firebase Firestore correctly
✅ Photo background visible through all translucent cards
✅ Loading screen is prominent and clear
✅ Fully responsive on mobile devices
✅ Deploys to Vercel without errors
✅ No console errors or warnings (except optional service worker)

---

## 🚨 Critical Notes

### NO FAKE PRICES
- If Claude API fails, show error message
- Do NOT show default prices like "10-50k for everything"
- User should see: "❌ Analysis Failed - Please try again"

### PHOTO BACKGROUND
- Always visible through card opacity (38%)
- Last photo persists on page reload
- Background sets mood for the app

### LOADING SCREEN
- FULLSCREEN with high contrast
- Impossible to miss or confuse with loading state
- Shows progress messages

---

## 💡 Tips for Testing

1. **Test with real Vietnamese price tags** if possible (best results)
2. **Try various items**: Produce, packaged goods, restaurant menus
3. **Test on real 4G connection** (API may be slower on cellular)
4. **Check mobile orientation**: Landscape vs portrait
5. **Test on different phone sizes**: Small (iPhone SE), Medium (iPhone 12), Large (iPad)

---

## 📞 Support

For issues or questions:
1. Check browser console (F12) for error messages
2. Check Vercel function logs for API errors
3. Verify Firebase project is accessible
4. Confirm ANTHROPIC_API_KEY is set in Vercel

---

**Ready to test? Start with Step 1: Local Testing, then move to Vercel deployment!**
