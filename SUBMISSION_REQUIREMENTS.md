# SUBMISSION_REQUIREMENTS.md - Platform Submission Checklist

---

## 📋 Pre-Submission Checklist

### ✅ Must-Have Requirements

**Technical (Poki & CrazyGames):**

- [ ] Mobile & tablet responsive (tested on 320px-1920px)
- [ ] Touch input working perfectly
- [ ] Mouse input working
- [ ] Load time <2 seconds
- [ ] Initial bundle ≤20MB
- [ ] Total bundle ≤50MB
- [ ] No console errors/warnings
- [ ] Game works offline (optional but good)
- [ ] Proper memory management (no leaks)
- [ ] 60 FPS stable (desktop + mobile)

**Poki-Specific:**

- [ ] Poki SDK integrated
- [ ] `PokiSDK.gameLoadingStart()` called on load
- [ ] `PokiSDK.gameLoadingStop()` called when ready
- [ ] `PokiSDK.gameStart()` on level start
- [ ] Mobile aspect ratio: 16:9 or 9:16
- [ ] Game thumbnail (960x540px)
- [ ] Description <150 characters
- [ ] All input types work (keyboard optional but good)

**CrazyGames-Specific:**

- [ ] CrazyGames SDK v3 integrated
- [ ] `CrazyGames.SDK.init()` on load
- [ ] `CrazyGames.SDK.game.gameplay()` on gameplay start
- [ ] Ad events tracked properly
- [ ] Brotli compression enabled
- [ ] No external dependencies (only CDN)
- [ ] Game thumbnail
- [ ] Metadata complete

**Content & Design:**

- [ ] No copyrighted material
- [ ] No real people in ads/game
- [ ] Family-friendly content (ESRB T or lower)
- [ ] Clear game title
- [ ] Professional looking UI
- [ ] Readable text on all screen sizes
- [ ] No flashing effects (epilepsy safe)

**Performance:**

- [ ] Tested on low-end devices (Android 6.0+)
- [ ] No memory leaks over 10+ minute play
- [ ] Battery drain acceptable
- [ ] Smooth animations (no jank)

**Functionality:**

- [ ] Level progression works
- [ ] Restart level works
- [ ] Sound effects working
- [ ] Music loop properly
- [ ] No stuck states (always a way to progress)
- [ ] Save/load works
- [ ] Quit without error

---

## 🎯 Poki Submission

### Step-by-Step Submission

**1. Create Developer Account**
```
URL: https://developers.poki.com/
✓ Sign up
✓ Accept Terms & Conditions
✓ Verify email
```

**2. Create Game Project**
```
Name: "Fixed Platform Puzzle" (or final title)
Description: "Logic puzzle game. Move blocks. Strategic removal."
Category: Puzzle
```

**3. Prepare Assets**

```
Thumbnail (960x540px):
├─ PNG format
├─ Game title visible
├─ Clear, eye-catching design
└─ No text >5 words

Title Screen Screenshot (1280x720px):
└─ Show main menu UI

Gameplay Screenshot (1280x720px):
└─ Show level in progress
```

**4. Write Game Description**

```
Title: Fixed Platform Puzzle

Short Description (max 150 chars):
"Move colored blocks off the grid. Wrong order = dead-end. 
Pure logic, no time pressure. Relaxing puzzle challenge."

Long Description (max 1000 chars):
"Test your logic skills in this strategic puzzle game. 
Arrange and remove blocks from the grid in the correct order. 
One wrong move can trap you - plan carefully!

Features:
✓ 50+ Progressively harder levels
✓ No time pressure - puzzle at your own pace
✓ Satisfying removal mechanics
✓ Play on mobile, tablet, or desktop

Perfect for casual puzzle fans."
```

**5. Build Output**

```
dist/
├── index.html          (Main entry point)
├── game.min.js         (Core game, Brotli compressed)
├── game.min.css        (UI styles, optional)
├── images/             (Spritesheet, 2-4MB)
├── audio/              (Sound effects, <500KB)
└── manifest.json       (Game metadata)
```

**6. Upload to Poki**

```
Dashboard → My Games → Upload Build

Files to Upload:
✓ index.html
✓ game.min.js
✓ assets/ folder
✓ manifest.json (optional)

Size limit: 250MB total
File count: Max 1500 files
```

**7. Test on Poki Staging**

```
URL: https://poki.dev/games/<game-id>

Checklist:
✓ Game loads in <2 sec
✓ Mobile: Swipe/tap work
✓ Desktop: Mouse/click work
✓ Level progression
✓ No ads showing (staging)
✓ Audio working
✓ No console errors
```

**8. SDK Implementation Verification**

```typescript
// Verify these are called:
✓ PokiSDK.gameLoadingStart() - on initial load
✓ PokiSDK.gameLoadingStop() - when playable
✓ PokiSDK.gameStart() - on level start
✓ PokiSDK.gameStop() - on pause
✓ PokiSDK.contextStart() - (contextual ads, optional)

// No calls to:
✗ External ad networks (Poki handles ads)
✗ External analytics (Poki provides analytics)
```

**9. Submit for Review**

```
Dashboard → Submit for Review

Wait 1-7 days for:
✓ QA testing (gameplay)
✓ Technical validation
✓ Content review
✓ Performance check

Possible outcomes:
✓ Approved → Game goes live
△ Needs changes → Feedback + resubmit
✗ Rejected → Detailed reason given
```

---

## 🎮 CrazyGames Submission

### Step-by-Step Submission

**1. Create Developer Account**

```
URL: https://developer.crazygames.com/
✓ Sign up
✓ Fill profile
✓ Verify email
```

**2. Game Information**

```
Title: Fixed Platform Puzzle
Description: Grid-based logic puzzle game.
Genre: Puzzle
Category: Casual
```

**3. Build Requirements**

**Size Limits (CrazyGames Specific):**

```
├─ Initial load: ≤50MB (≤20MB for mobile homepage)
├─ Total size: ≤250MB
├─ File count: ≤1500 files
└─ Compression: Brotli or Gzip required
```

**4. Prepare Assets**

```
Game Thumbnail (1280x720px):
├─ PNG format
├─ Portrait or landscape
├─ Title visible
└─ Clear gameplay scene

Screenshots:
├─ Menu screen (1280x720)
├─ Gameplay 1 (1280x720)
├─ Gameplay 2 (1280x720)
└─ Level complete (1280x720)
```

**5. Build Output**

```
dist/
├── index.html
├── game.min.js.br      (Brotli compressed)
├── game.min.js.gz      (Gzip fallback, optional)
├── styles.css
├── images/
├── audio/
└── favicon.ico

Compression Check:
$ npm run build
$ du -sh dist/
$ file dist/game.min.js.br
→ gzip compressed data (should show)
```

**6. Upload to CrazyGames**

```
Developer Portal → Submit a Game → Upload Build

Upload Process:
1. Drag & drop dist/ folder OR
2. Select files individually
3. System validates:
   ✓ Size limits OK
   ✓ File count OK
   ✓ Compression detected
   ✓ index.html present
4. Click Submit

Wait for QA validation (instant to 1 hour)
```

**7. Test via Preview**

```
URL: https://developer.crazygames.com/preview/<game-id>

Test on:
✓ Desktop (Chrome, Firefox)
✓ Mobile (iOS Safari, Chrome)
✓ Tablet
✓ Slow network (DevTools throttle)

Verify:
✓ Load time acceptable
✓ Touch input responsive
✓ No lag/jank
✓ Audio clear
✓ No 404s in console
```

**8. SDK Implementation**

```typescript
// CrazyGames SDK v3 Integration

<script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script>

import { CrazyGames } from '@crazygames/sdk';

// Initialize
await CrazyGames.SDK.init();

// Track gameplay
CrazyGames.SDK.game.gameplay?.();

// Ad events
CrazyGames.SDK.ad.adStart?.();
CrazyGames.SDK.ad.adFinished?.();
CrazyGames.SDK.ad.adError?.();

// Suggested ad placements:
├─ Before gameplay (optional interstitial)
├─ After level complete (rewarded video)
├─ On hint usage (rewarded video)
└─ Pause menu (optional banner)
```

**9. Monetization Verification**

```
✓ Ads enabled in dashboard
✓ Ad network IDs configured
✓ Revenue share settings confirmed
✓ Payout method added (if applicable)

CrazyGames Options:
├─ 2 months exclusivity: 50% revenue share
└─ Non-exclusive: Standard revenue share (varies)
```

**10. Submit for Review**

```
Developer Portal → Games → Submit for Review

CrazyGames Review (24-72 hours):
✓ Technical validation
✓ Gameplay testing
✓ Ad integration check
✓ Content compliance
✓ Performance benchmark

Feedback:
✓ Approved → Eligible for Basic Launch
△ Needs fixes → Resubmit
✗ Rejected → Reason provided

After Basic Launch (1-2 weeks):
→ Full Launch (global distribution)
  IF: Good metrics (D1 retention, avg playtime, etc)
```

---

## 📊 Quality Checklist

### Technical Validation

```
Performance:
☐ Load time: <2s (measured with Chrome DevTools)
☐ First paint: <500ms
☐ Interactive: <3s
☐ FPS: 60 stable (no consistent drops)
☐ Memory: <80MB sustained
☐ CPU: <30% average

Compatibility:
☐ Chrome 80+
☐ Firefox 75+
☐ Safari 13+
☐ Edge 80+
☐ iOS Safari (11+)
☐ Chrome Mobile (latest)

Mobile:
☐ Responsive 320-1920px
☐ Touch friendly (tap targets ≥40px)
☐ Portrait & landscape
☐ No keyboard popup (auto)
☐ Safe area aware (notch, etc)
```

### Gameplay Validation

```
Core Loop:
☐ First game playable in <10 sec
☐ Objectives clear without tutorials
☐ Feedback instant (sound/animation)
☐ No stuck states (always progress possible)
☐ Difficulty increases gradually

Progression:
☐ 10+ levels playable
☐ Each level teaches something new
☐ Difficulty curve smooth
☐ No difficulty spike (expect +15% per level max)

Polish:
☐ No typos
☐ UI readable all devices
☐ Buttons clickable/tappable
☐ Visual consistency
☐ No placeholder graphics
```

### Content Validation

```
Appropriateness:
☐ No graphic violence
☐ No sexual content
☐ No hate speech
☐ No real people (avatars only)
☐ ESRB T or lower

Branding:
☐ No copyrighted characters
☐ No trademarked logos (unless licensed)
☐ Original game title
☐ Clear game description

Accessibility:
☐ Text readable (min 12pt)
☐ Color contrast (WCAG AA)
☐ No audio-only cues
☐ No flashing >3Hz (seizure risk)
```

---

## 🔄 Resubmission Process

**If Rejected:**

1. Read feedback carefully
2. Identify specific issues
3. Implement fixes
4. Test thoroughly (same checklist)
5. Resubmit with notes on changes

**Common Rejection Reasons:**

```
❌ "Game crashes on mobile"
   → Debug mobile, test on real device

❌ "Load time exceeds 5 seconds"
   → Optimize assets, compress, reduce bundle

❌ "Difficulty spike at level 5"
   → Reduce difficulty, add easier levels

❌ "Copyrighted artwork detected"
   → Replace with original assets

❌ "SDK not integrated"
   → Add SDK calls, verify in console
```

---

## 🚀 After Approval

### Post-Launch Monitoring

**Monitor Daily:**

```
Metrics Dashboard:
✓ Daily Active Users (DAU)
✓ Average session length
✓ Crash reports
✓ User feedback comments
✓ Ad performance (eCPM, CTR)
```

**Optimization:**

```
First Week:
├─ Fix any crashes
├─ Optimize load time (target <1.5s)
├─ Monitor difficulty (D1 retention >10%)
└─ Check ad revenue

First Month:
├─ Add features based on feedback
├─ Optimize difficulty curve
├─ Experiment with monetization
└─ Plan content updates
```

### Maintenance Patches

```
High Priority (fix immediately):
├─ Game-breaking bugs
├─ Crash on startup
├─ Loss of save data
└─ Ads not showing

Medium Priority (fix within week):
├─ Level difficulty issues
├─ Minor visual bugs
├─ Performance improvements
└─ UI/UX refinements

Low Priority (batch together):
├─ Visual polish
├─ New cosmetics
├─ Feature requests
└─ Localization
```

---

## 📞 Support

**Poki Support:** https://support.poki.com/  
**CrazyGames Support:** https://support.crazygames.com/  

**Common Issues & Solutions:**

| Issue | Solution |
|-------|----------|
| Game doesn't load | Check console for errors, verify bundle size |
| Ads not showing | Check SDK integration, verify ad networks |
| Retention too low | Difficulty curve, first-time experience |
| Performance lag | Profile with DevTools, optimize assets |

---

## 🔗 Related Documents

- [TECH_STACK.md](./TECH_STACK.md) - Technical requirements
- [DEVELOPMENT_ROADMAP.md](./DEVELOPMENT_ROADMAP.md) - Timeline to submission
