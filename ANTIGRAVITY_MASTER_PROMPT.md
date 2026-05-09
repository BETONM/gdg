# Antigravity Master Prompt

Copy this into Google Antigravity.

```text
You are my senior hackathon engineering agent inside Google Antigravity.

Goal:
Build a polished 4-hour MVP web app called "Hi Spot Daily" in this gdg folder.

Read these files first:
- PRD_DAILY_MISSION_AGENT.md
- GOOGLE_STACK_MVP_PLAN.md
- SPEC_DAILY_MISSION_AGENT.md

Product:
Hi Spot Daily is a Daily Mission Agent for young adults in their 20s living alone for the first time.
The user checks in once per day.
Gemini analyzes their current state and creates 3 small missions.
The user can also submit a living-alone tip such as a convenience store meal combo.
Gemini improves, structures, scores, and assigns points to the tip.

Mandatory Google stack:
- Gemini API
- Gemini structured output
- Firebase Hosting readiness
- Google Maps JavaScript API and Google Places API as optional/secondary support for map-based missions

Required 3-screen flow:
1. Daily Check-in
2. Gemini Agent Analysis + Mission Cards
3. Community Tip Sharing with Gemini Tip Review

Required demo flow:
Daily Check-in
-> Gemini state analysis
-> Gemini mission generation
-> Mission cards with points
-> Community tip input
-> Gemini tip review
-> Post tip
-> Points increase

Implementation rules:
- Use TypeScript.
- Use React with Vite or Next.js; choose the fastest reliable option for this folder.
- Build a clean single-page mobile-first app.
- Keep all state local.
- Do not add auth, database, payments, chat, or a large community system.
- Never expose GEMINI_API_KEY in client code.
- Add fallback sample data for mission generation and tip review failures.
- Google Maps/Places can be a small helper area only; do not let it delay the community tip screen.
- Keep the demo stable over feature count.

Before coding:
Summarize:
1. chosen stack
2. file structure
3. API routes or server functions
4. data contracts
5. fallback behavior
6. acceptance criteria

Then implement in vertical slices:

Slice 1:
- 3-screen static UI
- Mock mission cards
- Mock community tip review
- Point total UI

Slice 2:
- Gemini mission generation
- Structured output parsing
- fallbackMissionResult

Slice 3:
- Gemini tip review
- Structured output parsing
- fallbackTipReview
- Post-tip point increase

Slice 4:
- Optional map/places helper
- Error states
- Visual polish
- Firebase Hosting readiness

Verification:
- Install dependencies if needed.
- Run the dev server.
- Open the app in browser.
- Test the full demo flow:
  1. click sample check-in
  2. generate missions
  3. confirm 3 mission cards
  4. open community tip screen
  5. click sample tip
  6. review tip with Gemini or fallback
  7. post tip
  8. see point increase
- Check browser console errors.
- Fix blocking errors.

Output:
- Files changed
- How to run locally
- Required API keys
- Known limitations
- Browser verification notes

Do not overbuild.
Stop when the core demo flow is reliable and visually presentable.
```

## Corrective Prompts

If the agent overbuilds:

```text
Pause and reduce scope.
Only implement check-in -> Gemini JSON missions -> mission cards -> community tip input -> Gemini tip review -> post tip -> points.
Remove or postpone anything outside that flow.
```

If Gemini JSON breaks:

```text
Make the Gemini integration deterministic.
Use structured output / response schema if supported.
If parsing fails, load fallback data and show a small fallback notice.
The UI must not crash.
```

If Maps or Places takes too long:

```text
Postpone Maps/Places.
The required third screen is Community Tip Sharing, not a map completion screen.
Keep the app demoable with missions, tip review, and points.
```
