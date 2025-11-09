# Video Generation Feature - Implementation Plan

## Overview
Build video generation workflow: text input → narration → audio → 9:16 video

## Phase 1: Core Setup & Routing ✅
**Status:** Complete

### Tasks
- [x] Create `/src/app/video-generation/page.tsx` - landing page with input + button
- [x] Create `/src/app/video-generation/[runId]/page.tsx` - status/result page
- [x] Implement runId generation (crypto.randomUUID)
- [x] Setup localStorage storage: `localStorage.setItem(runId, text)`
- [x] Setup routing: input → /video-generation/[runId] (text in localStorage)
- [x] [runId] page reads text from localStorage, calls API, stores result

### Storage Strategy
- **Input text**: `localStorage[runId] = text`
- **Video result**: `localStorage[runId + '_result'] = videoUrl`
- Persists across refresh, no URL encoding limits

### Files Created
- `src/app/video-generation/page.tsx`
- `src/app/video-generation/[runId]/page.tsx`

---

## Phase 2: API Route & Workflow Structure
**Status:** Not Started

### Tasks
- [ ] Create `/src/app/api/video-generation/route.ts`
- [ ] Setup POST handler with request validation
- [ ] Define TypeScript types (inline)
- [ ] Add error handling structure
- [ ] Test basic request/response flow

### Files Created
- `src/app/api/video-generation/route.ts`

---

## Phase 3: Pipeline Steps (Placeholders)
**Status:** Not Started

### Tasks
- [ ] Implement `runProcessTranscript` (fal.ai) - returns mock narration JSON
- [ ] Implement `runGenerateNarration` (fal.ai) - returns mock mp3 URL
- [ ] Implement `runGenerateVideo` (fal.ai) - returns mock video URL
- [ ] Wire up sequential execution in route handler
- [ ] Add placeholder data for testing

### Implementation Notes
- All 3 steps use fal.ai client
- Synchronous execution (await each step)
- Return mock URLs for now

---

## Phase 4: UI Polish & Loading States
**Status:** Not Started

### Tasks
- [ ] Add loading spinner on [runId] page
- [ ] Style video player (9:16 aspect ratio)
- [ ] Add error states
- [ ] Use shadcn/ui Button, Input components
- [ ] Test full flow end-to-end

---

## Future Enhancements (Post-MVP)
- [ ] Switch to async polling instead of sync wait
- [ ] Add in-memory state storage for progress tracking
- [ ] Real fal.ai API implementations
- [ ] Progress indicators per step
- [ ] Video preview/download options
