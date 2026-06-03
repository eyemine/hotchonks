## Sovereign IP Pod Showcase — Build Plan

Builds a new section in this project (green-agent-chonks) alongside the existing gallery. Existing routes stay untouched; new routes added.

### Routes
- `/artists` — Virtual Artist Roster (Page 1)
- `/studio/:slug` — Artist Studio / Sidecar Inspector (Page 2)
- Existing `/` (gallery) untouched. Add a header link "Virtual Artists" to `/artists`.

### Page 1 — Virtual Artist Roster (`/artists`)
- Header: "VIRTUAL ARTISTS — Sovereign IP Pods" / "Own the identity. Unlock the sound."
- Featured hero card: **Chonk #697 Red Hammer** (1.5x width on desktop)
  - Full hero portrait background
  - Pixel Chonk NFT inset badge (bottom-left, neon green border)
  - "RED HAMMER" display type, "Industrial Breakbeat / G Minor"
  - Status pill `🔓 Story Protocol Active` (pulsing green)
  - CTA → `/studio/red-hammer` ("Enter Studio")
- Other cards (Kidman, Delilah, Sandy Freeland, plus others from existing PureBPM map):
  - Chonk image, name, genre placeholder
  - Status: `⏳ Agent Pending` or `🔒 Unregistered`
  - Muted CTA (disabled or "Coming Soon")
- Footer link to each PureBPM profile (reuse existing mapping from `mem://features/custom-nfts`).

### Page 2 — Artist Studio (`/studio/:slug`)
Dark theme, neon green `#00FF41` accent, JetBrains Mono for data panels.

**Top — Identity**
- Full-bleed hero portrait at 15% opacity
- Pixel Chonk badge inset + display name
- `@redhammer` → purebpm.com link
- `chonk.697_@nftmail.box` (muted, copy button)
- Badges: `.agent.gno`, `Story Protocol: Registered`, `CDR: Active`
- Collapsible "Protocol Infrastructure": TBA / Safe / Owner addresses

**Middle — IP Status**
- Story Protocol IP Asset `0x7832...b21` → StoryScan external link
- IP Portal link
- No license terms / no empty-license panels

**Bottom — Vault & Audio (tabs)**
- `PREVIEW`: 30s watermarked player, CRT static overlay when paused, autoplay on tab open, "GhostAgent Preview" tag
- `STUDIO`: vault status `🔒 ENCRYPTED`, big green "Unlock Full Track" button
  - Click → call edge function `cdr-unlock` → verify Chonk #697 ownership via Alchemy `ownerOf` on Base → on success returns signed audio URL → audio plays + spectrogram fills + "Download Master .wav" link appears
  - Spectrogram = Web Audio API `AnalyserNode` rendered to canvas in neon green

**Right rail — On-Chain Intelligence**
- Envio indexer status (reuse existing `envioQuery` + Metadata query)
- `story[ip_id]` shown ✅
- `cdr[vault_id]` shown 🔒
- Raw metadata collapsible (reuse existing pattern)
- No license token / license terms display

### Backend (Lovable Cloud + Edge Functions)
- **Wallet connect**: lightweight wagmi + injected connector to capture the user's address (needed to verify Chonk ownership). If the user has no wallet, show "Connect Wallet to Unlock".
- **Edge function `cdr-unlock`**:
  - Input: `{ tokenId, walletAddress }`
  - Validates wallet owns Chonk #697 via Alchemy `ownerOf` on Base (uses existing `ALCHEMY_API_KEY` if present, otherwise we'll prompt for it)
  - Returns `{ unlocked: true, audioUrl }` pointing at the placeholder full-track URL (swap later for real CDR-decrypted stream)
  - CORS enabled, public (no JWT)
- **Audio**:
  - Placeholder preview: a short hosted clip (use a Lovable-asset uploaded silent/short wav stub)
  - Placeholder full: a longer hosted clip stub
  - When you upload `preview_misbehaved.wav` and `misbehaved.wav` later, we swap two URLs in one file.

### Technical Notes
- Reuse: `envioApi`, `useChonksData`, existing NFT image URLs, PureBPM artist map.
- Add: `src/pages/Artists.tsx`, `src/pages/Studio.tsx`, `src/components/artists/*` (HeroCard, RosterCard, IdentityPanel, IPStatusPanel, AudioTabs, SpectrogramCanvas, OnChainRail), `src/hooks/useChonkOwnership.ts`, `src/lib/wallet.ts`, `supabase/functions/cdr-unlock/index.ts`.
- Routes registered in `App.tsx`.
- Header gets a "Virtual Artists" link.

### Out of scope (this pass)
- Real CDR decryption (operator key flow) — stubbed at edge-function boundary, ready to swap.
- Real watermarked audio rendering — uses provided files when uploaded.
- IP Portal page itself (only links out).

### After plan approval I will
1. Enable Lovable Cloud.
2. Ask for `ALCHEMY_API_KEY` if not already present.
3. Build the routes, components, hook, and edge function.
4. Wire wallet connect with wagmi.
5. Smoke-test the unlock path with a mock wallet address.
