# VibeCast — SeeReal Hackathon Build

During the Granola v0 Hackathon, I built [SeeReal](https://vibe-cast-peach.vercel.app/), a Next.js video recap workspace for an AI meeting-transcript accelerator. The goal: engineer tone-aware transcript-to-video workflows and deliver a demo-ready experience the judges could immediately run.

## Live Demo
- https://vibe-cast-peach.vercel.app

## What You Can Do
- Paste a raw meeting transcript, pick a tone preset (executive polish, product hype, meme chaos), and generate a storyboarded recap.
- Walk buyers through a polished marketing site that mirrors Stripe’s storytelling cadence, metrics grid, and glassmorphism accents.
- Show off a full end-to-end vision for how AI meeting notes can become bingeable, on-brand video recaps.

## Feature Highlights
- Hero section with gradient backdrop, product reels, dual CTAs, and social proof pulled from [`ASSETS.md`](./ASSETS.md).
- Value proposition and metrics cards tuned to enterprise buyers who need trustworthy AI tooling.
- Video generation workspace framed in glass panels with transcript input, tone presets, shot breakdown, and render queue.
- Fully responsive layout built to feel at home within Stripe’s design system, while keeping the VibeCast branding distinct.

## Architecture & Stack
- Next.js 14 App Router deployment hosted on Vercel.
- Tailwind CSS with design tokens and layout primitives centralized in `src/app/globals.css`.
- Shadcn UI components (`Button`, `Card`, `Badge`, etc.) for consistent interaction surfaces.
- Content and creative copy centralized in `ASSETS.md`, making the site easy to retheme for future pitches.

## Getting Started Locally
1. Install dependencies  
   ```bash
   pnpm install
   ```
   `package-lock.json` and `yarn.lock` are both checked in if you prefer npm or Yarn.
2. Run the dev server  
   ```bash
   pnpm dev
   ```
3. Visit http://localhost:3000 for the marketing experience.
4. Jump to http://localhost:3000/video-generation to try the transcript-to-video workspace.

## Project Structure
- `src/app/page.tsx` — Landing page composition and section orchestration.
- `src/app/video-generation/page.tsx` — Interactive workspace for tone-aware recaps.
- `src/app/globals.css` — Tailwind base layer and design tokens.
- `components/ui/*` — Reusable primitives tailored for the Stripe-inspired visuals.
- `ASSETS.md` — Centralized copy bank that powers hero, metrics, testimonials, and calls to action.

## Roadmap
- Wire real analytics into the metric cards and hero KPI callouts.
- Swap placeholder media with real transcript-to-video renders.
- Sketch out speaker diarization and automatic highlight selection before the render step.
- Add CMS-backed copy management so marketing teams can iterate without code updates.
