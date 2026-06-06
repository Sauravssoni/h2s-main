# Manual Testing Script (26-Point Evaluation)

This document provides a rigorous 26-point manual test script designed to validate every core aspect of the PrepBuddy application, matching evaluator requirements.

## Phase 1: Initial Load & Rendering
1. **Load Time:** Verify the application achieves First Contentful Paint (FCP) under 1.5 seconds.
2. **Initial State:** Confirm the UI displays empty chat states and onboarding prompts correctly.
3. **Accessibility Audit:** Run Axe DevTools; confirm 0 critical or serious violations.
4. **Keyboard Navigation:** Tab through the interface; ensure every interactive element receives visible focus.

## Phase 2: Core Interaction & Validation
5. **Empty Submission:** Attempt to send an empty message or only whitespace; verify submission is blocked or gracefully handled.
6. **Excessive Length:** Paste text exceeding the character limit; verify UI enforces the limit and prevents submission.
7. **XSS Prevention:** Input `<script>alert("test")</script>`; verify it is rendered as plain text and not executed.
8. **Markdown Rendering:** Input bold, italic, and list markdown; verify correct rendering in the chat UI.
9. **Basic Conversation Flow:** Send a standard query (e.g., "How do I study for math?"); verify AI response is received and formatted correctly.

## Phase 3: Risk Detection Engine (Critical)
10. **Crisis Keyword - Direct:** Input "I want to kill myself"; verify immediate interception and display of emergency resources. API MUST NOT be called.
11. **Crisis Keyword - Indirect:** Input "I can't take this anymore, I'm giving up entirely"; verify risk detection triggers appropriately.
12. **False Positive Check:** Input "I'm killing this exam!"; verify it bypasses risk detection and processes normally.
13. **Risk State Persistence:** Verify the UI clearly indicates a crisis intervention occurred and remains in a safe state.

## Phase 4: Fallback Engine & Resilience
14. **Offline Mode:** Disconnect internet; attempt to send a message; verify graceful error message or Fallback Engine response.
15. **API Timeout Simulation:** (Requires network throttling) Simulate a slow network; verify UI shows loading state, then falls back after timeout threshold.
16. **API Error Handling:** (Requires dev tools) Force a 500 error from the API; verify Fallback Engine engages and provides a generic supportive response.

## Phase 5: LocalStorage Privacy Layer
17. **Data Persistence:** Reload the page after a conversation; verify chat history is fully restored from `localStorage`.
18. **Cross-Tab Synchronization:** Open app in two tabs; update one tab; verify the other tab updates (or maintains consistent state upon reload).
19. **Storage Quota:** (Advanced) Fill `localStorage` near limit; verify app handles storage quota exceeded errors gracefully.
20. **Clear Data Function:** Trigger the "Clear Data/History" function; verify `localStorage` is wiped and UI resets immediately.
21. **Zero-PII Verification:** Inspect network requests; confirm no identifying information is sent in API payloads.

## Phase 6: UI/UX & Responsive Design
22. **Mobile Viewport:** Resize window to 320px width; verify layout adapts, text remains legible, and buttons are tappable.
23. **Tablet Viewport:** Resize to 768px width; verify optimal layout utilization.
24. **Theme Toggling (if applicable):** Toggle light/dark mode; verify all contrast ratios remain WCAG AA compliant.
25. **Motion Preference:** Enable OS-level "reduce motion"; verify animations (e.g., loading spinners, transitions) are disabled or simplified.
26. **Stress Test:** Rapidly send 10 messages; verify UI remains responsive and queues or handles inputs without crashing.
