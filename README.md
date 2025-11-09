## VibeCast Promo Page

Stripe-inspired marketing site for VibeCast, the AI assistant that transforms meeting transcripts into premium video recaps employees actually finish.

### Features
- Hero section with gradient backdrop, product reels, and dual CTAs.
- Value prop grid, metrics, feature spotlights, and testimonial pulled from [`ASSETS.md`](./ASSETS.md).
- Responsive layout that matches Stripe’s rhythm, typography scale, and glassmorphism accents.
- Video generation workspace with Stripe-inspired glass panels, transcript input, and tone presets (executive, product hype, meme chaos).

### Tech Stack
- Next.js 14 / App Router
- Tailwind CSS with design tokens in `globals.css`
- Shadcn UI primitives (`Button`, `Card`, `Badge`, etc.)

### Getting Started
1. Install dependencies  
   ```bash
   pnpm install
   ```
   _npm_ and _yarn_ lockfiles are included if you prefer alternate package managers.
2. Run the dev server  
   ```bash
   pnpm dev
   ```
3. Visit http://localhost:3000 to explore the landing page.
4. Navigate to http://localhost:3000/video-generation to try the recap workspace, paste a transcript, pick a tone preset, and queue a render.

### Project Structure
- `src/app/page.tsx` – Stripe-style landing page composition.
- `src/app/globals.css` – Global Tailwind layer and color tokens.
- `components/ui/*` – Reusable primitives (buttons, cards, etc.).
- `ASSETS.md` – Centralized copy bank feeding the page content.

### Next Steps
- Wire real analytics into the metrics cards.
- Swap static imagery/videos with live product captures.
- Add CMS-backed copy management for marketing teams.
