## Meeting Brainrot Generator

### TL;DR

Repurpose company town halls and product syncs into meme-fueled, AI-hosted recaps. Ingest meeting transcripts (Granola or equivalent), let teammates choose the vibe, have OpenAI script the recap, pipe it into a FAL workflow for a generated talking head, then layer in short-form dopamine bait so the signal finally cuts through the noise.

### Problem

- Mandatory meetings demand focus but rarely deliver concise, engaging momentum.
- Valuable insights end up buried in hour-long recordings or scattered notes.
- Teams crave snackable updates that still feel on-brand and human.

### Proposed Flow

1. **Capture** – Export transcript and key timestamps from Granola (or Otter, Zoom, etc.).
2. **Prep UI Input** – Paste transcript into the text area and select tone from the dropdown presets.
3. **Script** – Send transcript + tone to OpenAI to generate a short-form-friendly video script (voiceover + captions).
4. **Animate** – Forward the generated script to the FAL workflow and retrieve the synthesized talking-head video.
5. **Brainrot Layer** – Add B-roll, meme cuts, subtitles, emojis to keep attention high.
6. **Publish** – Push to internal hub (Notion, Slack, Teams) or public channels if needed.

### Things To Do

- [ ] Map MVP pipeline: transcript input → OpenAI scripting → FAL render → export.
- [ ] Define tone presets (executive serious, product hype, meme chaos).
- [ ] Implement text area + tone dropdown UI and wire it to the backend endpoint.
- [ ] Prototype OpenAI prompt that balances brevity, clarity, and tone in generated scripts.
- [ ] Integrate FAL workflow call, store the returned video, and surface status updates.
- [ ] Integrate Slack/Teams bot for distribution and feedback loop.

### Success Criteria

- 5-minute meeting recap becomes a 45–60 second clip with ≥80% retention.
- Content ready within 30 minutes after meeting ends.
- Stakeholders report higher recall vs. original meeting attendance.
