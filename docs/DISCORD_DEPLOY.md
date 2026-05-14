# Discord Activity — Deploy Runbook

Ship the game as a Discord Activity (embedded app in voice channels).

## Phase 1 (current): SDK handshake only

Game loads in Discord iframe via `discordSdk.ready()`. No OAuth, no server needed.

### 1. Create Discord application

1. https://discord.com/developers/applications → **New Application** → name it
2. Copy **Application ID** (`Client ID`) and **Client Secret** from OAuth2 page

### 2. Configure environment

```bash
cp .env.example .env
# edit .env, fill VITE_DISCORD_CLIENT_ID (Application ID)
# DISCORD_CLIENT_SECRET only required for Phase 2
```

### 3. Install dependencies

```bash
npm install
```

This pulls `@discord/embedded-app-sdk` (added in this PR).

### 4. Build the Discord variant

```bash
VITE_DISCORD_CLIENT_ID=$(grep VITE_DISCORD_CLIENT_ID .env | cut -d= -f2) npm run package:discord
```

Output: `dist/` + `submission/discord-build-v{version}.zip`.

### 5. Serve `dist/` locally

```bash
npx http-server dist -p 5173
```

(or any static server bound to `:5173`.)

### 6. Tunnel to public HTTPS URL

```bash
cloudflared tunnel --url http://localhost:5173
```

Copy the `https://*.trycloudflare.com` URL.

### 7. Register URL mapping in Discord

1. Discord Developer Portal → your app → **Activities → URL Mappings**
2. Add mapping: **Root** (`/`) → paste tunnel URL (strip `https://` prefix)
3. Save

### 8. Enable Developer Mode in Discord client

Settings → Advanced → **Developer Mode** ON.

### 9. Launch in a Voice Channel

1. Join any voice channel
2. Click the rocket icon ("Start an Activity")
3. Your app should appear in the list (only visible to App Testers if not yet released)
4. Game loads in iframe; loading splash dismisses when `SDKManager.init()` calls `discordSdk.ready()`

### 10. Add testers (optional)

Developer Portal → **App Testers → Invite**. They need to accept before seeing the activity.

---

## Phase 2 (deferred): OAuth + user-scoped storage

Required when you want per-user data (leaderboards, server-side progress).

1. `cd server && npm install`
2. `cd server && npm run dev` (listens on `:3001`)
3. Update `DiscordClient.ts` to call `commands.authorize` → `POST /api/token` → `commands.authenticate`
4. Add Phase 2 mapping in URL Mappings: `/api/token` → server tunnel URL
5. Extend `SDKManager.hasCloudStorage()` to return `true` for `discord`

## Production hosting (when ready)

- **Client** (`dist/`): Cloudflare Pages / Vercel / Netlify
- **Server** (`server/`): Cloudflare Workers / Vercel Functions / Render
- Both must be HTTPS. CSP on Discord iframe is strict — load assets only from registered URL mappings.

## Verification checklist

- [ ] `npm run package:discord` exits 0
- [ ] `submission/discord-build-v{version}.zip` ≤ 20 MB
- [ ] Game loads in voice-channel iframe, splash dismisses
- [ ] No console errors in browser devtools (right-click activity → Open DevTools)
- [ ] Editor scenes (CREATE LEVEL, PUBLIC LEVELS) hidden — only itch shows these
- [ ] Other builds still green: `npm run package:itch` + `package:poki` + `package:playgama` produce identical-to-previous bundles
- [ ] Bundle analyzer (`npm run analyze`) confirms `discord-sdk` chunk only emitted for `target=discord`

## Risks / gotchas

- **Bundle size**: `@discord/embedded-app-sdk` adds ~50 KB gzip. Dynamic import + DefinePlugin DCE keeps it out of other targets — verify per release.
- **`process.env.VITE_DISCORD_CLIENT_ID`** is injected at compile time via DefinePlugin. Must be set in the shell before `npm run package:discord`, not just in `.env` (unless you also `export $(cat .env | xargs)`).
- **CSP**: Discord proxies assets through `<app_id>.discordsays.com`. If you load external CDN fonts/images, register them in URL Mappings or the iframe will refuse them.
- **Submission**: Discord has no review queue like Poki — public release goes through App Discovery (separate approval, not covered here).
