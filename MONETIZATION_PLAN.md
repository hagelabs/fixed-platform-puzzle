# MONETIZATION_PLAN.md - Revenue Strategy

---

## 💰 Revenue Model Overview

**Primary:** Rewarded Video Ads (60%)  
**Secondary:** IAP - Cosmetics (30%)  
**Tertiary:** Subscription (10%)  

---

## 📺 Rewarded Video Ads

### Ad Placement Strategy

**Strategic Placement = High CTR, Good Retention**

```
GAME FLOW:
┌──────────────────┐
│   Level Start    │
├──────────────────┤
│   5-7 min        │ (No ads in active gameplay)
│   GAMEPLAY       │
├──────────────────┤
│   Level Win      │ ← AD #1 (Optional): "Watch for 2x coins"
│   Screen         │
├──────────────────┤
│   Next Level     │
│   Screen         │
├──────────────────┤
│   5-7 min        │
│   GAMEPLAY       │
├──────────────────┤
│   Dead End       │ ← AD #2 (Optional): "Watch to continue"
│   Screen         │
├──────────────────┤
│   Level Restart  │
```

### Ad Placement Details

**Placement 1: Level Complete (Optional Rewarded)**

```
Trigger: Player completes level
Content: "Watch video for 2x coins"
Button: [WATCH] [SKIP]

Why works:
✓ Momentum high (player won)
✓ Optional (respects time)
✓ Clear reward (coins visible)
✓ No friction (not forced)

Expected: 15-25% CTR
```

**Placement 2: Continue After Dead-End (Rewarded)**

```
Trigger: Player stuck, no valid moves
Content: "Watch to get 2 free hints + continue"
Button: [WATCH] [RESTART]

Why works:
✓ Player wants to continue
✓ Solving their pain (stuck)
✓ Clear value (2 hints shown)
✓ Natural friction point

Expected: 40-60% CTR (high motivation)
```

**Placement 3: Hint Request (Rewarded)**

```
Trigger: Player taps "Hint" button (no free hints left)
Content: "Watch video for free hint"
Button: [WATCH] [PASS]

Why works:
✓ Player actively requests
✓ Direct value exchange
✓ Voluntary (pass option)
✓ Rare (not every level)

Expected: 25-35% CTR
```

**Placement 4: Pause Menu (Banner - Optional)**

```
Trigger: Player pauses game
Content: Static banner ad (not video)
Position: Bottom of pause menu

Why:
✓ Non-intrusive (player already paused)
✓ CPM lower but acceptable
✓ No interruption

Expected: Low impact on retention
```

### Revenue Calculations

**Conservative Estimate (Month 1)**

```
Assumptions:
├─ 10,000 DAU
├─ 2 sessions/day per user = 20,000 sessions
├─ 1.5 ads/session = 30,000 impressions
├─ eCPM: $5 (web casual benchmark)
├─ Fill rate: 80% (conservative)

Revenue = (30,000 * 5 * 0.8) / 1000
        = (120,000 / 1000)
        = $120/day
        = ~$3,600/month (ad revenue only)
```

**Optimistic Estimate (Month 3, with growth)**

```
Assumptions:
├─ 50,000 DAU (organic growth)
├─ 2 sessions/day = 100,000 sessions
├─ 2 ads/session = 200,000 impressions
├─ eCPM: $6 (better targeting)
├─ Fill rate: 85%

Revenue = (200,000 * 6 * 0.85) / 1000
        = (1,020,000 / 1000)
        = $1,020/day
        = ~$30,600/month
```

---

## 🎁 In-App Purchases (IAP)

### IAP Strategy

**Philosophy:** Cosmetic-only. NO pay-to-win.

### Shop Items

**Block Skins ($0.99 each)**

```
Available:
├─ Glass blocks (translucent effect)
├─ Marble texture
├─ Neon glow (animated)
├─ Custom colors (purple, orange, pink)
└─ Holiday themes (seasonal)

Why:
✓ Visual only (no gameplay advantage)
✓ Affordable ($0.99 barrier low)
✓ High margin (cost: $0)
✓ Collectible (encourage repeat purchases)
```

**Board Themes ($1.99 each)**

```
Available:
├─ Dark mode (dark background, light blocks)
├─ Ocean theme (blue gradients, water particles)
├─ Minimalist (no grid lines, clean)
├─ Forest theme (nature colors, calm)
└─ Space theme (dark with stars)

Why:
✓ Environment changes (feels fresh)
✓ Higher price point ($1.99)
✓ Toggle easily
```

**Level Packs ($2.99 each)**

```
Available:
├─ Challenge Pack (50 harder levels)
├─ Story Pack (narrative-driven levels)
├─ Speedrun Pack (optimize-focused)
└─ Expert Pack (extreme difficulty)

Why:
✓ Content expansion
✓ Justifies higher price
✓ Gated content (unlock feeling)
✓ Replayability
```

### IAP Revenue Estimate

**Conservative (Month 1)**

```
Assumptions:
├─ 10,000 DAU
├─ 2% IAP conversion (very conservative)
├─ $1.20 average order value (1x skin)

Revenue = 10,000 * 0.02 * $1.20
        = $240/day
        = ~$7,200/month (IAP only)
```

**Total Revenue (Month 1)**
```
Ad Revenue: $3,600
IAP Revenue: $7,200
Total: ~$10,800/month
```

---

## 💳 Subscription (Optional)

### Subscription Model

**Season Pass ($2.99 / 2 weeks)**

```
Includes:
├─ Cosmetic exclusive skins
├─ +5 free hints per day
├─ 2x coin multiplier
├─ Battle pass progression
└─ Weekly exclusive levels

Why:
✓ Recurring revenue
✓ Low friction price point
✓ Valuable bonuses (not OP)
✓ Limited time (urgency)
```

### Subscription Revenue

**Conservative (Month 1)**

```
Assumptions:
├─ 10,000 DAU
├─ 0.5% subscription adoption (low)
├─ $2.99/week per subscriber
├─ 2-week retention: 60%

Active Subscribers = 10,000 * 0.005 = 50
Weekly Cohort = 50 / 0.6 = 83 new subs
Revenue per week = 83 * $2.99 = $248
Monthly revenue = $248 * 4 weeks = ~$992/month
```

**Note:** Subscription is OPTIONAL. Focus on ads + cosmetics first.

---

## 🎯 Combined Revenue Projection

### Month-by-Month Estimate

```
MONTH 1 (Launch + Basic Launch)
├─ DAU: 10K
├─ Ad Revenue: $3,600
├─ IAP Revenue: $7,200
├─ Subscription: $1,000
└─ TOTAL: ~$11,800

MONTH 2 (Organic growth + patches)
├─ DAU: 30K
├─ Ad Revenue: $10,800
├─ IAP Revenue: $21,600
├─ Subscription: $3,000
└─ TOTAL: ~$35,400

MONTH 3 (Content update + Full Launch)
├─ DAU: 50K
├─ Ad Revenue: $18,000
├─ IAP Revenue: $36,000
├─ Subscription: $5,000
└─ TOTAL: ~$59,000
```

**Assumptions:**
- Organic growth (no paid UA initially)
- Retention improves with updates
- IAP conversion stays stable
- Ad eCPM improves with audience data

---

## 📊 KPIs to Monitor

### Monetization Metrics

```
Ad Metrics:
├─ eCPM (effective cost per mille)
├─ CTR (click-through rate)
├─ Fill rate (% of requests with ads)
├─ Video completion rate
└─ Ad revenue per DAU (ARPDAU)

IAP Metrics:
├─ Conversion rate (% who buy)
├─ Average revenue per paying user (ARPPU)
├─ Most popular item
├─ Repeat purchase rate
└─ Lifetime value (LTV)

Overall:
├─ ARPU (average revenue per user)
├─ LTV:CAC ratio
├─ Payback period
└─ Month-over-month growth
```

### Target KPIs

```
Ad CTR: 8-12% (rewarded good)
Fill Rate: 80%+ (good networks)
eCPM: $4-8 (casual web benchmark)

IAP Conversion: 1-3% (normal casual)
ARPPU: $1.50-3.00 (if buy)

ARPU Goal: $0.20-0.30/user/month
ARPDAU: $0.15-0.25
```

---

## 🚫 Anti-Monetization Best Practices

### DO NOT

```
❌ Force ads between every level
❌ Ads that interrupt active gameplay
❌ Ads longer than 30 seconds
❌ Misleading ad calls ("Free Gems!")
❌ Multiple ads in quick succession
❌ Paywalls that gate content unfairly
❌ Aggressive IAP nudging
❌ Pay-to-win mechanics
```

### DO

```
✓ Respect player time
✓ Clear, honest offers
✓ Optional ads (rewards clear)
✓ Natural friction points
✓ Quality content > aggressive monetization
✓ Cosmetics as IAP (no gameplay advantage)
✓ Easy opt-out paths
✓ Transparent pricing
```

---

## 💡 Optimization Strategy

### Phase 1: Gather Data (Week 1-2)

```
Launch with:
├─ 2-3 rewarded video placements
├─ Basic cosmetics ($0.99)
├─ NO subscription yet
├─ Minimal IAP

Goals:
✓ Measure baseline metrics
✓ Identify natural friction points
✓ Understand player preferences
```

### Phase 2: Experiment (Week 3-4)

```
A/B Test:
├─ Ad placement timing (immediately vs delayed)
├─ Ad frequency (1 vs 2 per session)
├─ Cosmetic pricing ($0.99 vs $1.99)
├─ Offer messaging ("2x coins" vs "Double rewards")

Metrics:
├─ Retention impact (lower = bad)
├─ CTR impact
├─ Revenue impact
```

### Phase 3: Optimize (Month 2+)

```
Based on Phase 2 results:
├─ Double down on high-performing offers
├─ Remove low-performing placements
├─ Launch subscription (if data supports)
├─ Add premium cosmetics ($2.99+)
├─ Test new ad formats (banner, static)
```

---

## 🔗 Ad Networks

### Recommended Networks

**Primary (Poki/CrazyGames Handles):**
- Google AdMob (via platform)
- Bidding networks (platform selected)

**Fallback (own SDK):**
- DummyAds (placeholder, internal)

**Note:** Don't integrate third-party ad networks manually. Let platform handle distribution. It maximizes revenue.

---

## 💸 Revenue Share

### Platform Revenue Share

**Poki:**
```
Standard: 50% to developer (game)
         50% to Poki

With Exclusivity: 70% to developer
                  30% to Poki
(2-month exclusivity period)
```

**CrazyGames:**
```
Standard: 50-70% to developer (varies)
         30-50% to CrazyGames

With Exclusivity: 50% extra (higher % to developer)
(2-month exclusivity period)
```

**Typical Monthly Breakdown:**

```
Gross Revenue: $50,000
├─ Platform cut: $25,000 (50%)
└─ Developer cut: $25,000

After expenses:
├─ Server costs: $500
├─ Analytics tools: $100
└─ Net profit: $24,400
```

---

## 🏆 Success Metrics

### Month 1 Goals

```
✓ ARPU: $0.15+/user
✓ Ad CTR: 8%+
✓ IAP conversion: 1%+
✓ Retention D1: 10%+ (shows monetization not aggressive)
```

### Month 3 Goals

```
✓ ARPU: $0.25+/user (growth from Month 1)
✓ Ad CTR: 12%+ (better targeting data)
✓ IAP conversion: 2%+ (more items, better design)
✓ Subscription: 0.5%+ adoption (if launched)
```

### 6-Month Goals

```
✓ ARPU: $0.35+/user (optimized monetization)
✓ Monthly revenue: $15K-30K+ (depends on DAU)
✓ Subscription: 1%+ adoption
✓ Repeat IAP rate: 20%+ of IAP buyers
```

---

## 📚 Related Documents

- [PROJECT_BRIEF.md](./PROJECT_BRIEF.md) - Financial projections
- [GAME_DESIGN.md](./GAME_DESIGN.md) - Level progression (IAP integration)
- [DEVELOPMENT_ROADMAP.md](./DEVELOPMENT_ROADMAP.md) - Implementation timeline
