# System Architecture

PrepBuddy is built as a highly responsive, privacy-first, client-heavy application. This architecture ensures immediate feedback, robust safety mechanisms, and complete data sovereignty.

## Core Architectural Principles
1. **Client-Centricity:** Heavy lifting, including preliminary risk assessment and state management, happens in the browser.
2. **Privacy by Design:** Zero server-side persistence of user data.
3. **Resilience:** Graceful degradation through fallback mechanisms.

## Data Flow

The data flow is designed to prioritize safety and speed.

1. **User Input:** The user submits a message via the UI.
2. **Sanitization & Validation:** The input is immediately sanitized to prevent XSS and validated against length constraints.
3. **Risk Detection Layer (Crucial Step):**
   - The sanitized input is passed through a local, synchronous Risk Detection Engine.
   - It checks against a curated dictionary of crisis keywords and heuristic patterns.
   - *If Risk Detected:* The flow short-circuits. A hard-coded emergency intervention response is generated. The AI API is **not** called.
4. **AI Generation (If Safe):**
   - If no immediate risk is detected, the prompt (along with relevant local context) is securely transmitted to the AI API (e.g., Google Gemini) via an edge function or secure proxy.
5. **Response Processing:** The AI response is received, parsed, and prepared for rendering.
6. **State Update & Storage:** The UI is updated with the new message, and the updated conversation thread is serialized and saved to `localStorage`.

## Key Components

### 1. Risk Detection Before AI
By placing the Risk Detection Layer *before* the AI API call, we guarantee that users in immediate crisis receive deterministic, verified support information instantly, completely eliminating the risk of AI hallucination in sensitive scenarios.

### 2. Validation Flow
Input undergoes strict validation. It is trimmed, sanitized, and type-checked before entering the application state. This prevents malformed data from corrupting the `localStorage` state or causing rendering errors.

### 3. Fallback Engine
A local heuristic engine acts as a safety net. If the connection to the AI API fails, times out, or returns a 5xx error, the Fallback Engine intercepts the failure and generates a generalized, supportive response based on local logic, ensuring the user is never left with a silent interface.

### 4. LocalStorage Privacy Layer
The application operates entirely statelessly from a server perspective.
- A `StorageManager` utility handles all interactions with `localStorage`.
- It encrypts (or obfuscates) sensitive state data before saving and handles deserialization upon app load.
- This guarantees the Zero-PII policy, as no data ever rests on a PrepBuddy server.

## Deployment Architecture
PrepBuddy is deployed on **Vercel**.
- **Edge Network:** Leverages Vercel's global CDN for ultra-fast asset delivery.
- **Serverless/Edge Functions:** API calls to external LLMs are routed through Vercel Edge Functions. This securely masks API keys from the client while maintaining low latency.
- **CI/CD:** Automated deployments ensure rapid iteration and continuous testing on every commit.
