# PrepBuddy — Exam Wellness Copilot

> **Hack2Skill PromptWars** · Mental Wellness Tracker Challenge

PrepBuddy is a student exam-season wellness tracker. It helps students preparing for JEE, NEET, CUET, CAT, GATE, UPSC, and board exams complete a 60-second daily check-in, understand stress triggers, reflect safely, and receive a personalised daily support plan.

---

## Problem Solved

Exam students face stress, anxiety, burnout, comparison pressure, and uncertainty — but most mental wellness tools are either generic meditation apps or clinical therapy platforms. They do not understand the specific, time-bound stress patterns of exam preparation.

PrepBuddy is built for this exact gap:

- Mock test crash after bad scores
- Final 7-day panic and sleep disruption
- Result waiting anxiety and uncertainty
- Comparison with peers and coaching pressure
- Syllabus backlog paralysis

---

## Core User Flow

```
Landing → Start Check-In →
  Step 1: Exam Context (exam type, phase, study hours) →
  Step 2: Mind & Body (mood, stress, anxiety, energy, sleep, focus, confidence) →
  Step 3: Stress Triggers (chip selection) →
  Step 4: Reflection (journal entry) →
  Generate Wellness Plan →
Results: Snapshot + Triggers + Reset Plan + Study Plan + Reflection Insight + Calm Exercise + Journey Dashboard + Safety Card
```

---

## Features

| Feature | Description |
|---|---|
| 60-second check-in | 4-step form: exam context, mind & body, triggers, reflection |
| Stress trigger map | 14 triggers with per-trigger action advice |
| Personalized 3-step reset | Breathing → study action → recovery |
| Study + recovery plan | Intensity-adjusted study blocks + avoid list |
| Reflection insight | Safe, non-diagnostic reflection summary |
| 2-minute calm exercise | Box breathing / grounding / naming the controllable |
| 7-day journey dashboard | Streak, mood trend, stress trend, top triggers (localStorage) |
| Panic-to-Plan mode | 3-step rescue plan for overwhelmed states |
| Safety support card | Crisis keyword bypass with Tele-MANAS resources |
| AI enhancement (optional) | Gemini API for reflection insight and phase advice |
| Deterministic fallback | Full plan generated without AI; always works offline |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 App Router |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Validation | Zod |
| Testing | Vitest |
| Storage | LocalStorage (no database) |
| AI (optional) | Gemini API (server-side only) |
| Deployment | Vercel |

---

## Setup

```bash
git clone https://github.com/Sauravssoni/hack-2-skill
cd hack-2-skill
npm install
cp .env.example .env.local
# Optionally add GEMINI_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

```env
GEMINI_API_KEY=your_key_here  # Optional — app works without it
```

**Never use `NEXT_PUBLIC_` prefix for API keys.** PrepBuddy enforces server-side-only AI access.

---

## Optional AI Mode

If `GEMINI_API_KEY` is set in `.env.local`:
- Reflection insight and exam phase advice are enhanced by Gemini
- AI response is validated as JSON and merged with the deterministic plan
- If AI fails or times out (>8s), the deterministic fallback is used silently

If no API key is set:
- The deterministic wellness engine generates the full plan
- No degradation in core functionality

---

## Fallback Mode

PrepBuddy works 100% without any API key. The `/lib/wellness-engine.ts` deterministic engine:
- Calculates wellness status from stress, energy, sleep, mood
- Maps triggers to specific actions
- Generates phase-specific study + recovery plans
- Detects crisis keywords and shows safety card
- Always returns the complete `WellnessPlan` type

---

## Security Notes

- No student data stored on any server
- LocalStorage only for journey history
- Rate limited: 5 requests per minute per IP
- Zod input validation on every API call
- Text inputs sanitized and length-capped
- No `dangerouslySetInnerHTML`
- No `NEXT_PUBLIC_` API keys
- Security headers: X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy
- Crisis keywords bypass AI — safety response shown immediately

See [SECURITY.md](SECURITY.md) for details.

---

## Accessibility Notes

- Semantic HTML: `main`, `header`, `section`, `footer`, `fieldset`, `legend`
- All inputs have labels or `aria-label`
- Slider fields have `aria-valuemin/max/now`
- `aria-live="polite"` on results and loading states
- `aria-live="assertive"` on crisis safety card
- Keyboard-navigable chip groups with `role="checkbox"` and `aria-checked`
- Visible focus rings on all interactive elements
- `prefers-reduced-motion` support via CSS
- Screen-reader-only step announcer in CheckInForm

See [ACCESSIBILITY.md](ACCESSIBILITY.md) for details.

---

## Testing Commands

```bash
npm run test           # Run all 93 tests once
npm run test:watch     # Watch mode
npm run typecheck      # TypeScript strict check
npm run lint           # ESLint
npm run build          # Production build
```

See [TESTING.md](TESTING.md) for test coverage details.

---

## Demo Flow

1. Open the app → Click **Try Sample Student** (JEE · Mock Test Week)
2. Check-in is pre-filled with: Anxious mood, Stress 8/10, Confidence 3/10
3. Triggers: Mock test score, Syllabus backlog, Comparison with friends, Parental pressure
4. Reflection: "I feel like everyone is ahead of me and my mock score is not improving."
5. Click **Generate Wellness Plan**
6. See: Status "Heavy day" → Trigger Map → Panic-to-Plan → 3-Step Reset → Study Plan
7. Show Journey Dashboard (empty on first run, builds over time)
8. Show Safety Support card

Key demo line: *"PrepBuddy doesn't just say 'calm down.' It identifies the exam-stress loop and converts it into one safe next action."*

---

## Rubric Mapping

### Code Quality ✅
- Strict TypeScript with zero `any`
- 15 modular components with clear boundaries
- 8 focused lib modules (types, constants, validation, security, engine, AI, risk, storage, utils)
- Centralized types and constants
- Small, single-purpose functions

### Security ✅
- Server-side Zod validation on every request
- IP-based rate limiting (5 req/min)
- Input sanitization — HTML tags stripped, length capped
- No server-side storage of student wellness data
- No `NEXT_PUBLIC_` API keys
- Crisis keyword detection overrides AI — safety-first response only
- Security headers on all routes

### Efficiency ✅
- No database, no authentication overhead
- LocalStorage-only history (< 1ms reads)
- Lightweight SVG/CSS chart (no heavy chart library)
- Deterministic fallback engine — instant if AI unavailable
- Vercel Edge-compatible API route
- Memoized journey stats computation

### Testing ✅
- 93 unit tests across 4 test files
- Validation, risk detection, wellness engine, storage helpers all tested
- Edge cases: empty inputs, NaN, very long strings, crisis keywords, out-of-range numbers

### Accessibility ✅
- Full semantic HTML structure
- All form inputs labelled
- `aria-live` regions for dynamic content
- Keyboard-navigable chip groups
- Visible focus rings throughout
- `prefers-reduced-motion` CSS support
- Screen-reader-only loading announcements
