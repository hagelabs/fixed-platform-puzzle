# PROJECT_BRIEF.md - Fixed Platform Puzzle Game

---

## 📊 Executive Summary

**Game:** Fixed Platform Puzzle (FPP) - Grid-based logic puzzle  
**Type:** Casual / Puzzle  
**Platforms:** Web (HTML5 / WebGL)  
**Distribution:** Poki, CrazyGames, standalone site  
**Target Demo:** 18-60, casual/puzzle gamers  
**Timeline:** MVP 2-3 weeks, launch week 3-4  

---

## 🎯 Market Opportunity

### Why This Game? Why Now?

**Market Status:** 🔴 HOT (2026)

Fixed Platform Puzzle mechanics trending:
- **Growth:** Emerging from "Jam" game evolution
- **Market Segment:** Grid-based logic (no 3D physics)
- **Retention:** Higher than hyper-casual (no timer stress)
- **Monetization:** Clean ads + IAP model (37% YoY growth hybrid games)

### Competitive Landscape

| Game | Status | Revenue | Core Loop |
|------|--------|---------|-----------|
| Parking Jam | Mature | 10M+ DL | Move car, avoid deadlock |
| Bus Jam | Mature | 5M+ DL | Similar mechanics |
| **FPP (Ours)** | **Green field** | **TBD** | **Blocks + color logic** |

**Advantage:** Less saturated than Parking Jam. Unique block-color twist.

---

## 🎮 Game Concept

### Core Mechanic

**Grid Board:** 6x6 / 7x7 grid  
**Blocks:** Color-coded (Red, Blue, Green, Yellow)  
**Goal:** Move all blocks OFF board  
**Rule:** Wrong order = dead-end (no undo, restart level)  

**Example Level:**
```
[R][R][B][ ][ ][ ]
[R][B][B][ ][ ][ ]
[G][G][G][ ][ ][ ]
[Y][Y][ ][ ][ ][ ]
[ ][ ][ ][ ][ ][ ]
[ ][ ][ ][ ][ ][ ]
```

Must remove blocks in RIGHT order or risk dead-end.

### Why It Works

1. **Low Barrier Entry** - Move blocks = understand game in 10 seconds
2. **High Engagement** - "Aha moment" when puzzle solved
3. **Replayability** - RNG variant + difficulty scaling
4. **Mobile Native** - Tap/drag feel natural on phone/tablet
5. **No Filler** - No timer, no wait mechanics. Pure logic

---

## 👥 Target Audience

### Primary: Casual Puzzle Fans (40-60 yrs)
- Play puzzle games 30+ min daily
- Prefer relaxing, no-pressure mechanics
- High spend on cosmetics
- PC + mobile mix

### Secondary: Younger Gamers (18-35)
- Indie game enthusiasts
- Speedrun potential (future content)
- Social sharing (leaderboard hype)
- 100% mobile

### Tertiary: Mobile-First Players (All ages)
- Web gaming adoption growing
- Less willing to download app
- High sensitivity to load time

---

## 📈 Business Model

### Revenue Streams

1. **Rewarded Video Ads (60%)**
   - Hint unlock
   - Continue after dead-end
   - Double rewards events
   - Target: 2-3 ads/session

2. **Optional IAP (30%)**
   - Level packs ($0.99)
   - Cosmetic block skins ($1.99)
   - Time-limited challenge pass ($2.99 / season)

3. **Subscription (10%)**
   - Weekly ad-free pass ($1.99)
   - Exclusive levels access
   - Season battle pass

### Monetization Philosophy

**NOT aggressive.** Game respects player time:
- No forced ads interrupt flow
- Spending voluntary (hints only, not progression)
- F2P path fully playable

**Why?** 
- Royal Match (same category) proved: High ARPU through trust + value proposition
- Respect time = better retention = more impressions = higher ad revenue

---

## 📊 Financial Projections (Conservative)

### Assumptions
- 5,000 concurrent users Day 1 (Poki basic launch)
- 10% D1 retention
- 15% D7 retention
- ARPU: $0.20/user/month (conservative, casual benchmark)
- Ad eCPM: $5-8 (web average)

### Month 1 Estimate
```
Users: 10,000 → 50,000 (viral coefficient 0.3)
Impressions: ~200K ads
Ad Revenue: $1,000 - $1,500
IAP Revenue: $300 - $500
Total: ~$1,300 - $2,000
```

### Month 3+ (with updates)
```
Users: 50,000 → 250,000
Impressions: ~1.5M ads/month
Ad Revenue: $7,500 - $12,000
IAP Revenue: $2,000 - $3,000
Total: ~$10K - $15K/month
```

**Note:** Projection conservative. Top casual games earn 10x higher.

---

## 🏆 Success Criteria

### Launch Metrics (Week 1-2)

| Metric | Target | Benchmark |
|--------|--------|-----------|
| Users Day 1 | 5K+ | Poki Basic Launch avg |
| D1 Retention | 10%+ | Casual puzzle standard |
| Avg Session | 5+ min | No pressure = longer play |
| Crashes | 0 | Critical |

### 30-Day Metrics

| Metric | Target |
|--------|--------|
| DAU | 15K+ |
| D7 Retention | 20%+ |
| D30 Retention | 8%+ |
| ARPU | $0.15-0.25 |
| CPI (via organic) | <$0.50 |

### Long-Term (90 Days)

- Feature expansion (challenge modes)
- Leaderboard implementation
- Seasonal content (live ops)
- 100K+ DAU target

---

## 🚀 Go-to-Market Strategy

### Phase 1: Soft Launch (Week 3)
- Submit Poki "Basic Launch"
- Submit CrazyGames parallel
- Get organic momentum
- Gather player feedback

### Phase 2: Scale (Week 4+)
- Optimize based on retention data
- Add cosmetics (skins) if ARPU low
- Feature update (challenge mode)
- Leverage YouTube Gaming clips

### Phase 3: Content (Month 2)
- Seasonal events
- Leaderboard rankings
- Social sharing rewards
- Expansion to other platforms (itch.io)

---

## ⚠️ Risk Mitigation

| Risk | Likelihood | Mitigation |
|------|------------|-----------|
| Poor retention | Medium | Early playtesting, difficulty tuning |
| High load time | Low | Webpack optimization, size <20MB |
| Platform rejection (Poki) | Low | Follow checklist strictly |
| Ad network issues | Low | Integrate multiple providers (DummyAds fallback) |
| Feature scope creep | Medium | Strict MVP scope, post-launch updates only |

---

## 🎬 Unique Value Proposition

**Why players choose FPP over Parking Jam:**

1. **Novel mechanic** - Color block logic (not just car positioning)
2. **No timer stress** - Relaxing, think at own pace
3. **Smart difficulty** - Scales gradually, never unfair
4. **Satisfying feedback** - ASMR-like block removal sound/animation
5. **Quick session** - 3-5 min optimal, no grind feel

---

## 📋 Next Steps

1. **Validate Concept** - Internal playtesting 1-2 days
2. **Prototype Core Loop** - Grid + move logic (2-3 days)
3. **Test Level Design** - Ensure fun/difficulty curve (3-4 days)
4. **SDK Integration** - Poki + CrazyGames (2 days)
5. **Polish & Optimize** - Load time, mobile UX (2 days)
6. **Submit** - Poki Basic Launch (1 day)

---

## 🔗 Related Documents

- [GAME_DESIGN.md](./GAME_DESIGN.md) - Detailed mechanics
- [MONETIZATION_PLAN.md](./MONETIZATION_PLAN.md) - Revenue implementation
- [DEVELOPMENT_ROADMAP.md](./DEVELOPMENT_ROADMAP.md) - Timeline
