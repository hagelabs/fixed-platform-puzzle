# DEVELOPMENT_ROADMAP.md - Development Timeline & Milestones

---

## 📅 Project Overview

**Total Timeline:** 3-4 weeks to launch  
**Team Size:** 1 person (solo dev friendly)  
**MVP Scope:** 50 levels, core mechanics, basic monetization  

---

## 🎯 Phase Breakdown

### Phase 0: Pre-Development (Days 1-2)

**Setup & Planning**

```
Day 1:
├─ [ ] Initialize Git repo
├─ [ ] Create npm project
├─ [ ] Install Phaser 3 + dependencies
├─ [ ] Setup Webpack config
├─ [ ] Create folder structure (src/, assets/)
└─ [ ] Verify build & dev server works

Day 2:
├─ [ ] Create GameConfig (Phaser scene setup)
├─ [ ] Setup TypeScript config
├─ [ ] Create game constants file
├─ [ ] Setup Zustand store (game state)
└─ [ ] Test: npm run dev (loads blank game)

Deliverable: Blank game template, ready to build
```

---

### Phase 1: Core Game (Days 3-6)

**Game Logic & Mechanics**

```
Day 3: Grid System
├─ [ ] Grid class (6x6 / 7x7)
├─ [ ] Block data structure
├─ [ ] Position validation logic
├─ [ ] Grid rendering (canvas/graphics)
└─ Test: Grid visible, blocks at correct positions

Day 4: Block Movement
├─ [ ] InputManager (touch/mouse detection)
├─ [ ] Block drag logic
├─ [ ] Movement validation (can move?)
├─ [ ] Visual feedback (highlight valid zones)
└─ Test: Drag block → moves correctly

Day 5: Game Logic
├─ [ ] Win condition (all blocks removed?)
├─ [ ] Dead-end detection (no valid moves?)
├─ [ ] Level progression logic
├─ [ ] Save/load level state
└─ Test: Win level, see completion screen

Day 6: Level System
├─ [ ] Level data format (JSON)
├─ [ ] 50 hardcoded levels (difficulty curve)
├─ [ ] Level loader
├─ [ ] Progress tracker (unlocked level)
└─ Test: Play levels 1-50, progression saves

Deliverable: Playable game. 50 levels. No UI/audio yet.
```

---

### Phase 2: UI & Polish (Days 7-9)

**User Interface & Feedback**

```
Day 7: UI Screens
├─ [ ] MenuScene (main menu)
├─ [ ] GameScene UI (level number, score)
├─ [ ] PauseScene (pause overlay)
├─ [ ] GameOverScene (level complete)
├─ [ ] Level select screen (optional MVP)
└─ Test: All screens navigate correctly

Day 8: Visual Polish
├─ [ ] Block removal animation (dissolve/pop)
├─ [ ] Level complete animation (confetti)
├─ [ ] Visual feedback on valid/invalid moves
├─ [ ] Smooth transitions between screens
├─ [ ] Responsive scaling (all device sizes)
└─ Test: Looks polished on mobile/desktop

Day 9: Audio
├─ [ ] Block drag sound (tap click)
├─ [ ] Block removal sound (pop/dissolve) - ASMR
├─ [ ] Level complete jingle
├─ [ ] Menu background music (loop)
├─ [ ] Mute button in settings
├─ [ ] AudioManager integration
└─ Test: All sounds play, no overlaps, ASMR quality

Deliverable: Playable game with UI, animations, sounds.
```

---

### Phase 3: SDK Integration (Days 10-11)

**Platform Integration & Monetization**

```
Day 10: Poki SDK
├─ [ ] Include Poki SDK script
├─ [ ] Implement PokiSDK.gameLoadingStart()
├─ [ ] Implement PokiSDK.gameLoadingStop()
├─ [ ] Implement PokiSDK.gameStart() on level start
├─ [ ] Test SDK calls in console
├─ [ ] Create Poki metadata file
└─ Test: SDK calls visible in DevTools console

Day 10 (Afternoon): CrazyGames SDK
├─ [ ] Include CrazyGames SDK v3 script
├─ [ ] Implement CrazyGames.SDK.init()
├─ [ ] Implement gameplay() event
├─ [ ] Implement ad lifecycle events
├─ [ ] Test SDK integration
└─ Test: SDK logs show proper initialization

Day 11: Ad Placement
├─ [ ] Implement ad manager (AdManager class)
├─ [ ] Placement 1: Level complete (rewarded)
├─ [ ] Placement 2: Dead-end continue (rewarded)
├─ [ ] Placement 3: Hint request (rewarded)
├─ [ ] Test with DummyAds (local testing)
├─ [ ] Analytics event tracking (Poki/Crazy)
└─ Test: Ads show at right moments (local)

Deliverable: Fully SDK-integrated, monetization ready
```

---

### Phase 4: Testing & Optimization (Days 12-13)

**QA & Performance Tuning**

```
Day 12: Testing
├─ [ ] Test on real mobile devices (Android + iOS)
├─ [ ] Test on desktop (Chrome, Firefox, Safari)
├─ [ ] Verify responsive design (320px-1920px)
├─ [ ] Test touch input (swipe, tap, drag)
├─ [ ] Test mouse input (click, hold, release)
├─ [ ] Play through all 50 levels
├─ [ ] Check for memory leaks (DevTools)
├─ [ ] Verify all sounds working
├─ [ ] Test on slow network (DevTools throttle)
└─ Test: No crashes, smooth gameplay, good retention feel

Day 12 (Afternoon): Bug Fixes
├─ [ ] Fix any crashes found
├─ [ ] Fix UI layout issues (mobile/desktop)
├─ [ ] Fix audio issues (overlap, static)
├─ [ ] Fix input responsiveness
└─ Document all fixes

Day 13: Optimization
├─ [ ] Profile with Chrome DevTools (Performance)
├─ [ ] Optimize image assets (compress)
├─ [ ] Optimize audio (bitrate reduction)
├─ [ ] Minify & bundle code
├─ [ ] Enable Brotli compression
├─ [ ] Measure bundle size: target <3MB
├─ [ ] Optimize load time: target <2s
├─ [ ] Test on low-end device (Moto G or equiv)
└─ Measure: Bundle size, load time, FPS

Deliverable: Fully tested, optimized, ready for submission
```

---

### Phase 5: Submission (Days 14-21)

**Platform Submission Process**

```
Day 14: Pre-Submission Checklist
├─ [ ] Review SUBMISSION_REQUIREMENTS.md
├─ [ ] Complete technical checklist
├─ [ ] Complete gameplay checklist
├─ [ ] Create game thumbnail (960x540)
├─ [ ] Write game description
├─ [ ] Prepare screenshots
├─ [ ] Build final production bundle
└─ Verify: All requirements met

Day 15: Poki Submission
├─ [ ] Create Poki developer account
├─ [ ] Create game project
├─ [ ] Upload build to Poki staging
├─ [ ] Test on Poki staging environment
├─ [ ] Verify SDK integration on Poki
├─ [ ] Submit for Poki Basic Launch
└─ Status: Awaiting Poki QA (1-7 days)

Day 15 (Parallel): CrazyGames Submission
├─ [ ] Create CrazyGames developer account
├─ [ ] Upload build to CrazyGames
├─ [ ] Verify compression (Brotli)
├─ [ ] Test on CrazyGames preview
├─ [ ] Submit for CrazyGames review
└─ Status: Awaiting CrazyGames QA (24-72 hours)

Days 16-21: Monitoring & Iteration
├─ Monitor feedback from platforms
├─ Fix any issues found by QA
├─ Resubmit if needed
├─ Prepare for launch day
└─ Monitor early analytics

Deliverable: Game live on Poki & CrazyGames (Basic Launch)
```

---

## 📊 Detailed Breakdown by Task

### Core Game Tasks (Phase 1)

| Task | Difficulty | Time | Owner |
|------|-----------|------|-------|
| Grid System | Low | 2h | Dev |
| Block Logic | Medium | 4h | Dev |
| Input Handling | Medium | 3h | Dev |
| Win Condition | Low | 1h | Dev |
| Level Data | Low | 2h | Dev |
| **Total** | **Medium** | **12h** | **Dev** |

### UI Tasks (Phase 2)

| Task | Difficulty | Time | Owner |
|------|-----------|------|-------|
| Menu Screens | Low | 2h | Dev |
| Game UI | Low | 2h | Dev |
| Animations | Medium | 3h | Dev |
| Audio | Low | 2h | Dev |
| Responsive Design | Medium | 3h | Dev |
| **Total** | **Medium** | **12h** | **Dev** |

### SDK Tasks (Phase 3)

| Task | Difficulty | Time | Owner |
|------|-----------|------|-------|
| Poki SDK | Low | 2h | Dev |
| CrazyGames SDK | Low | 2h | Dev |
| Ad Manager | Medium | 2h | Dev |
| Ad Placement | Low | 2h | Dev |
| Analytics | Low | 1h | Dev |
| **Total** | **Low-Medium** | **9h** | **Dev** |

### Testing Tasks (Phase 4)

| Task | Difficulty | Time | Owner |
|------|-----------|------|-------|
| Mobile Testing | Medium | 3h | Dev |
| Desktop Testing | Low | 2h | Dev |
| Bug Fixes | Variable | 3h | Dev |
| Performance Optimization | Medium | 3h | Dev |
| Final Polish | Low | 2h | Dev |
| **Total** | **Medium** | **13h** | **Dev** |

### Submission Tasks (Phase 5)

| Task | Difficulty | Time | Owner |
|------|-----------|------|-------|
| Pre-submission QA | Low | 2h | Dev |
| Poki Submission | Low | 2h | Dev |
| CrazyGames Submission | Low | 2h | Dev |
| Monitoring & Fixes | Variable | 4h | Dev |
| **Total** | **Low** | **10h** | **Dev** |

---

## ⏱️ Time Estimate Summary

```
Phase 0 (Setup):          16 hours
Phase 1 (Core Game):      12 hours
Phase 2 (UI & Audio):     12 hours
Phase 3 (SDK):             9 hours
Phase 4 (Testing):        13 hours
Phase 5 (Submission):     10 hours
─────────────────────────────────
TOTAL:                    72 hours (~2 weeks @ 8h/day)
                          OR 3-4 weeks @ 4h/day
                          OR 1 week intensive (8-10h/day)
```

---

## 🎯 Milestones

### Milestone 1: Playable MVP (Day 6)
```
✓ Game is playable
✓ 50 levels completable
✓ Score/progression tracking
✓ No UI/audio (functional only)

Gate: Can complete at least 5 levels without crashing
```

### Milestone 2: Polish & Feedback Ready (Day 9)
```
✓ Full UI (menus, screens)
✓ Animations & sounds
✓ Mobile responsive
✓ Ready for internal playtest

Gate: Friends/family can play without issues
```

### Milestone 3: SDK Integration Complete (Day 11)
```
✓ Both SDKs integrated
✓ Ads show correctly
✓ Analytics tracking
✓ Monetization ready

Gate: All SDK calls logged in console
```

### Milestone 4: Fully Tested (Day 13)
```
✓ Tested on 3+ devices (mobile, tablet, desktop)
✓ No crashes
✓ <2s load time
✓ Performance optimized
✓ All requirements met

Gate: 60+ minute continuous play without issues
```

### Milestone 5: Live on Platforms (Day 21)
```
✓ Poki Basic Launch approved
✓ CrazyGames approved
✓ >1000 users (first week)
✓ D1 retention >8%

Gate: Game playable and earning revenue
```

---

## 🚦 Risk & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|-----------|
| Scope creep | High | Medium | Strict MVP scope, post-launch updates |
| Performance issues | High | Low | Early profiling, optimize early |
| SDK integration delays | Medium | Low | SDK docs clear, early integration |
| Difficulty balance off | Medium | Medium | Internal playtesting Day 8-9 |
| Platform rejection | High | Low | Follow requirements strictly |
| Low retention | Medium | Medium | Difficulty tuning, playtest feedback |

---

## 📈 Post-Launch (Week 4+)

### Week 4-5: Launch Window

```
Monitor:
├─ Daily active users (DAU)
├─ Session length
├─ Crash reports
├─ User feedback
├─ Ad revenue
└─ Retention (D1, D7)

Actions:
├─ Fix critical bugs immediately
├─ Optimize difficulty if retention low
├─ Improve load time if needed
└─ Communicate with platforms
```

### Week 6-8: First Content Update

```
Plan (based on feedback):
├─ 20 new levels (harder)
├─ Cosmetic block skins
├─ Board themes
├─ Challenge mode
└─ Fix retention issues if any

Goal: Improve D7 retention to 20%+
```

### Month 2+: Scale & Optimize

```
Focus:
├─ Seasonal events (limited-time levels)
├─ Leaderboard implementation
├─ Battle pass system
├─ YouTube/TikTok marketing
└─ Feature expansion based on data
```

---

## 🔄 Agile Process (Recommended)

### Daily Standup (15 min)

```
Questions:
├─ What did I build yesterday?
├─ What am I building today?
├─ Any blockers?
└─ Update time estimate
```

### Sprint Reviews (Every 3 days)

```
Check:
├─ Playable build test
├─ Milestone progress
├─ Quality of work
├─ Scope adherence
└─ Adjust timeline if needed
```

### Post-Phase Retrospective

```
Questions:
├─ What went well?
├─ What could improve?
├─ Lessons for next phase?
└─ Adjust process if needed
```

---

## 📚 Documentation Requirements

### During Development

```
Day 1: Keep CLAUDE.md updated
Day 7: Update GAME_DESIGN.md with actual design
Day 11: Document SDK implementation in TECH_STACK.md
Day 13: Complete SUBMISSION_REQUIREMENTS.md checklist
Day 14: Finalize all documentation
```

### Git Commit Messages (Format)

```
[PHASE-TASK] Brief description

Day 3: [1-GRID] Implement grid system foundation
Day 4: [1-INPUT] Add touch input detection
Day 7: [2-UI] Create menu scene structure
Day 10: [3-SDK] Integrate Poki SDK
Day 13: [4-OPTIMIZE] Reduce bundle size to 2.5MB
```

---

## ✅ Daily Checklist Template

```
[Date: Day X]
Phase: [0-5]

Completed:
☐ Task 1
☐ Task 2
☐ Task 3

Testing:
☐ Tested on mobile
☐ Tested on desktop
☐ No console errors
☐ Playable end-to-end

Blockers:
(If any)

Time Logged: X hours
Remaining Time: X hours
Progress: X%
```

---

## 🔗 Related Documents

- [CLAUDE.md](./CLAUDE.md) - Overall project guide
- [SUBMISSION_REQUIREMENTS.md](./SUBMISSION_REQUIREMENTS.md) - Day 14 checklist
- [TECH_STACK.md](./TECH_STACK.md) - Technical setup (Day 1)
- [GAME_DESIGN.md](./GAME_DESIGN.md) - Reference during Phase 1
