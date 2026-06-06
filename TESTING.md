# Testing Strategy

PrepBuddy employs a comprehensive testing strategy using **Vitest** to ensure the reliability, accuracy, and safety of our application. Our suite prioritizes the critical logic surrounding user safety, data handling, and core functionalities.

## Testing Framework
- **Test Runner:** Vitest
- **Mocking:** Vitest's built-in mocking capabilities (for DOM elements, localStorage, and external APIs).

## Test Coverage Areas

### 1. Validation Logic
We rigorously test all input validation mechanisms to prevent malformed data and ensure application stability.
- **Boundary Testing:** Checking behavior at the limits of acceptable input lengths.
- **Sanitization Verification:** Ensuring XSS payloads and malicious scripts are stripped or escaped before rendering.
- **Type Checking:** Validating that data structures passed between components match expected TypeScript interfaces.

### 2. Risk Detection Engine
This is the most critical part of our test suite. The Risk Detection Engine must reliably identify crisis keywords and trigger the appropriate interventions.
- **Keyword Matching:** Tests verify that variations of critical keywords (e.g., "suicide", "harm", "give up") consistently trigger the crisis protocol.
- **False Positive Tuning:** We test against benign phrases that contain sensitive words in different contexts to ensure the system does not overreact.
- **Intervention Routing:** Tests confirm that when a risk is detected, the standard AI workflow is bypassed, and the emergency response payload is returned immediately.

### 3. LocalStorage Manager
Given our commitment to Zero-PII and client-side storage, testing the storage layer is vital.
- **Serialization/Deserialization:** Ensuring complex objects (like conversation histories) are accurately converted to and from JSON.
- **Quota Management:** Testing how the application handles `localStorage` limits (e.g., graceful degradation when storage is full).
- **Data Persistence:** Verifying that data remains intact across page reloads and simulated browser sessions.
- **Purge Functionality:** Testing that the user's ability to delete their data completely wipes the `localStorage`.

### 4. Wellness Engine (AI Orchestration)
Testing the orchestration logic that connects the UI, Risk Engine, and AI APIs.
- **API Mocking:** We use mocks to simulate responses from the Gemini API, ensuring the application handles successful responses, timeouts, and errors gracefully.
- **State Management:** Verifying that the UI correctly reflects loading states, error states, and ready states based on the engine's status.

### 5. Fallback Engine
- **Trigger Conditions:** Tests ensure the Fallback Engine activates precisely when the primary AI fails or times out.
- **Response Generation:** Verifying that the fallback responses are contextually appropriate based on predefined heuristics.

## Running Tests
To execute the test suite locally:
```bash
npm run test
# or to run with coverage report
npm run test:coverage
```
