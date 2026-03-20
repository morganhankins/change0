# TODOS

## Voice Prompts (Web Speech API)
**What:** Promote voice prompts from nice-to-have to shipped feature using `window.speechSynthesis`.
**Why:** Closes the gap in the "zero adult required" premise for 6-year-olds who can't read fluently.
**Pros:** Free, zero deps, zero cost, works offline, ~20 lines of code.
**Cons:** Voice quality varies by browser/OS; some voices sound robotic.
**Context:** Deferred in eng review (2026-03-19) to hit hackathon timeline. The design doc says "voice prompts + big visuals carry the whole experience" — this is load-bearing post-demo. The customer request (`"Rex wants to buy an apple for 47 cents!"`) should be read aloud when a new round starts, and success/failure feedback should be voiced. Use `window.speechSynthesis.speak()` with a `SpeechSynthesisUtterance`. Add a mute toggle in the UI for classroom use.
**Depends on:** Nothing — standalone addition after MVP ships.

## Responsive / Phone Portrait Layout
**What:** The 35/25/35 landscape layout breaks on a phone in portrait orientation. Needs a portrait-specific layout with adjusted zone heights and a scrollable coin tray.
**Why:** Parents share the link to their phones first. A broken portrait layout fails the first impression for the "parents & teachers" audience.
**Pros:** Opens phone as a valid device; significantly widens the shareable-link use case.
**Cons:** ~1 hour extra of responsive CSS + cross-device testing.
**Context:** Deferred for hackathon timeline. The primary design target is landscape tablet (35/25/35 split). Portrait phone needs its own layout pass — character zone gets ~40% height, register zone ~25%, coin tray ~35% with horizontal scroll if needed. Use Tailwind's `portrait:` and `landscape:` modifiers.
**Depends on:** Core landscape layout must be complete first.
