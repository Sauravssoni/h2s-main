# Accessibility (a11y) Guidelines

PrepBuddy is committed to providing an inclusive and accessible experience for all users, regardless of their abilities or the assistive technologies they use. We adhere to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.

## Implemented Features

### 1. Semantic HTML and ARIA Roles
- We use semantic HTML elements (`<main>`, `<nav>`, `<section>`, `<article>`, `<button>`, `<input>`) to provide inherent meaning and structure to assistive technologies.
- **ARIA Roles:** Where semantic HTML is insufficient, we utilize ARIA (Accessible Rich Internet Applications) roles to clarify the purpose of custom components (e.g., `role="alert"`, `role="dialog"`, `role="log"` for the chat interface).

### 2. ARIA Labels and Descriptions
- **`aria-label`:** All icon-only buttons and interactive elements without visible text are equipped with descriptive `aria-label` attributes to ensure screen reader users understand their function.
- **`aria-describedby`:** Complex inputs or error messages are linked to their descriptive text using `aria-describedby`, providing necessary context.

### 3. Dynamic Content Announcements (`aria-live`)
- The chat interface is dynamic. To ensure screen reader users are notified of new messages from the AI or system alerts, we utilize `aria-live` regions.
- New messages are injected into areas marked with `aria-live="polite"`, ensuring the screen reader announces them at an appropriate time without interrupting the user. Critical alerts (like crisis intervention) may use `aria-live="assertive"`.

### 4. Keyboard Navigation
- **Focus Management:** All interactive elements are fully accessible via keyboard (Tab and Shift+Tab).
- **Visible Focus States:** We maintain clear, high-contrast focus rings around active elements, ensuring sighted keyboard users can easily track their position on the page.
- **Skip Links:** We provide hidden "skip to main content" links at the top of the page to allow keyboard and screen reader users to bypass repetitive navigation links.

### 5. `prefers-reduced-motion` Support
- We respect the user's operating system settings regarding motion.
- CSS media queries (`@media (prefers-reduced-motion: reduce)`) are utilized to disable or significantly reduce non-essential animations, transitions, and smooth scrolling for users who experience discomfort from UI motion.

### 6. Color Contrast and Typography
- All text and interactive elements meet or exceed the WCAG AA contrast ratio requirements (4.5:1 for normal text, 3:1 for large text).
- We use relative units (rem, em) for typography, ensuring text scales gracefully when users adjust their browser's default font size.

## Continuous Auditing
We regularly audit our application using automated tools (like Lighthouse and axe-core) and manual testing with screen readers to identify and resolve accessibility issues.
