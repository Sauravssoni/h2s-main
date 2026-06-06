# PrepBuddy Code Quality Guidelines

To maintain a robust, scalable, and secure application, all contributions to PrepBuddy must adhere to the following code quality standards.

## 1. Strict Typing (TypeScript)
We utilize TypeScript to catch errors at compile-time and self-document our code.
- **No `any`:** The use of `any` is strictly prohibited. Define explicit interfaces or types for all data structures, API payloads, and component props.
- **Strict Mode:** `tsconfig.json` is configured with `"strict": true`. All strict checks (e.g., `strictNullChecks`, `noImplicitAny`) must pass.
- **Type Guards:** Use custom type guards when dealing with uncertain external data (like `localStorage` parsing) to ensure runtime safety.

## 2. Error Boundaries & Handling
The application must never crash entirely.
- **React Error Boundaries:** Wrap major sections of the UI (especially the chat view and AI interaction components) in Error Boundaries.
- **Graceful Degradation:** If a component fails, it should display a user-friendly error message or fallback UI, not a blank screen.
- **Try/Catch Blocks:** All asynchronous operations (API calls, localStorage parsing) must be wrapped in `try/catch` blocks with appropriate error logging (to console) and user-facing notifications.

## 3. Modularity and Separation of Concerns
Code must be organized into distinct, focused modules.
- **UI Components:** React components should primarily handle presentation.
- **Business Logic Hook/Services:** Complex logic (state orchestration, AI API calls, risk detection) should be abstracted into custom hooks or pure utility functions.
- **Risk Engine Isolation:** The Risk Detection logic must remain completely decoupled from UI components to allow for independent, rigorous unit testing.

## 4. High-Performance Rendering
Given the dynamic nature of a chat application, performance is key.
- **Memoization:** Use `React.memo`, `useMemo`, and `useCallback` judiciously to prevent unnecessary re-renders of large lists (like the chat history).
- **Virtualization:** For extremely long chat histories, implement list virtualization (e.g., using `react-window`) to only render visible DOM nodes.
- **Optimized Assets:** Ensure all SVGs and icons are optimized. Load external scripts asynchronously where possible.

## 5. Security & Validation
- **Input Sanitization:** All user inputs must be sanitized before processing or rendering to prevent DOM-based XSS.
- **Never Trust the Client:** Even though we use `localStorage`, treat data read from it as potentially corrupted or tampered with; validate it upon deserialization.
