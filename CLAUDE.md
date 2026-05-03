# Fixed Platform Puzzle Game - Project Documentation

**Status:** Pre-Development  
**Last Updated:** May 2026  
**Target Platforms:** Poki, CrazyGames (Web Browser)  

---

## 📖 Quick Navigation

Mulai dari sini untuk memahami project:

1. **[PROJECT_BRIEF.md](./PROJECT_BRIEF.md)** - Overview dan target market
2. **[GAME_DESIGN.md](./GAME_DESIGN.md)** - Mekanik game dan gameplay loop
3. **[TECH_STACK.md](./TECH_STACK.md)** - Technology requirements
4. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Code structure dan design patterns
5. **[SUBMISSION_REQUIREMENTS.md](./SUBMISSION_REQUIREMENTS.md)** - Poki & CrazyGames requirements
6. **[MONETIZATION_PLAN.md](./MONETIZATION_PLAN.md)** - Revenue strategy
7. **[DEVELOPMENT_ROADMAP.md](./DEVELOPMENT_ROADMAP.md)** - Timeline dan milestones

---

## 🎯 Project Summary

**Nama:** Fixed Platform Puzzle Game (TBD)

**Deskripsi Singkat:**  
Grid-based puzzle game. Move colored blocks keluar board. Order penting. Logic-driven, no timer stress. Web-native untuk Poki & CrazyGames.

**Core Appeal:**  
- Mudah dimulai
- Aha-moment satisfaction
- Replayable infinite
- Mobile-optimized

**Target Players:**  
- Casual gamers (35-60 years)
- Puzzle enthusiasts (18-45)
- Mobile + desktop players

**Market Status:** HOT (2026)

---

## 🚀 Quick Facts

| Aspek | Detail |
|-------|--------|
| **Engine** | Phaser 3 |
| **Language** | JavaScript + TypeScript |
| **Build Size** | ≤20MB (initial) |
| **Platforms** | Web (Poki, CrazyGames) |
| **Monetization** | Ads (primary) + IAP (optional) |
| **MVP Timeline** | 2-3 minggu |
| **Development** | Solo / small team |

---

## 📁 File Structure

```
project-root/
├── CLAUDE.md (ini)
├── PROJECT_BRIEF.md
├── GAME_DESIGN.md
├── TECH_STACK.md
├── ARCHITECTURE.md
├── SUBMISSION_REQUIREMENTS.md
├── MONETIZATION_PLAN.md
├── DEVELOPMENT_ROADMAP.md
│
├── src/
│   ├── main.ts
│   ├── scenes/
│   ├── entities/
│   ├── managers/
│   ├── utils/
│   └── config/
│
├── assets/
│   ├── images/
│   ├── sounds/
│   └── data/
│
├── webpack.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🛠️ Setup Instructions (Dev)

### Prerequisites
- Node.js 18+
- npm/yarn
- VS Code (recommended)

### Install & Run

```bash
# Clone / setup project
git clone <repo>
cd fixed-platform-puzzle

# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Size analysis
npm run analyze
```

---

## 📋 Development Checklist

### Phase 1: Core Game (Week 1)
- [ ] Grid system + block logic
- [ ] Input handling (touch + mouse)
- [ ] Win condition detection
- [ ] Level progression

### Phase 2: Polish (Week 2)
- [ ] UI/UX refinement
- [ ] Sound effects (ASMR)
- [ ] Animation tweaks
- [ ] Mobile responsiveness

### Phase 3: SDK & Monetization (Week 2-3)
- [ ] Poki SDK integration
- [ ] CrazyGames SDK integration
- [ ] Ad implementation
- [ ] Analytics tracking

### Phase 4: Testing & Submission (Week 3)
- [ ] QA testing
- [ ] Performance optimization
- [ ] Submit Poki
- [ ] Submit CrazyGames

---

## 🎮 Game Loop (Overview)

1. Player lihat grid board
2. Drag/tap blocks keluar board
3. Order urutan critical → dead-end jika salah
4. Berhasil → unlock level berikutnya
5. Progression bertambah sulit
6. Meta-game: unlock challenge mode

---

## 💰 Revenue Model (Hybrid)

- **Primary:** Rewarded video ads
- **Secondary:** Cosmetic skins
- **Tertiary:** Level pass subscription (optional)

Target ARPU: $0.15-0.30 (casual game benchmark)

---

## 🔗 External Resources

**Frameworks:**
- [Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

**Platform SDKs:**
- [Poki SDK Docs](https://sdk.poki.com/)
- [CrazyGames SDK Docs](https://docs.crazygames.com/)

**Game Design Reference:**
- Parking Jam, Bus Jam (mekanik reference)
- Royal Match (monetization reference)

**Market Data:**
- Fixed Platform Puzzle trending 2026
- Hybrid casual games +37% IAP revenue YoY

---

## 📞 Support & Questions

Jika ada pertanyaan saat development:
1. Check dokumentasi relevant (.md)
2. Review ARCHITECTURE.md untuk code patterns
3. Check TECH_STACK.md untuk library recommendations
4. Review SUBMISSION_REQUIREMENTS.md sebelum publish

---

## 🏁 Success Metrics

**Launch Goals:**
- Basic Launch pada Poki (target: 2 minggu)
- 1000+ downloads H1
- 15%+ D1 retention

**Post-Launch:**
- Monitor D1/D7/D30 retention
- ARPU optimization via A/B testing ads
- Feature expansion based on player feedback

---

**Next Step:** Baca [PROJECT_BRIEF.md](./PROJECT_BRIEF.md) untuk detailed project overview.
