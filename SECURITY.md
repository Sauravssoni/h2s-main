# Security Policy

At PrepBuddy, security and user privacy are fundamental to our architecture, not afterthoughts. Our platform is designed to assist students managing academic stress while ensuring complete data sovereignty and anonymity.

## Zero-PII Policy

PrepBuddy strictly enforces a **Zero Personally Identifiable Information (Zero-PII)** policy. 
- We do not ask for, collect, or store any personal data such as names, email addresses, phone numbers, or academic institutions.
- Our AI prompts and risk detection algorithms are designed to operate purely on the contextual and emotional content of user inputs, without needing to know *who* the user is.

## Local Storage Architecture

To guarantee privacy, we have intentionally designed the application to run without a traditional database for user data.
- **Client-Side Only:** All user conversations, preferences, and interaction histories are stored exclusively on the user's device using standard Web `localStorage`.
- **No Backend Database:** We do not maintain a database of user chat logs. Once the session ends or the browser cache is cleared, the data is permanently deleted from the device.
- **Data Sovereignty:** The user retains complete control over their data.

## Fallback Engine

Our system includes a robust fallback mechanism to ensure uninterrupted support, even during API outages or network disruptions.
- If the primary AI engine is unavailable or times out, the Fallback Engine automatically intervenes.
- It provides context-aware, locally generated responses to ensure the user always receives a helpful and empathetic reply, maintaining the illusion of continuous connectivity and support.

## Crisis Keyword Interception

Student mental health is paramount. We have implemented a rigid, rule-based **Risk Detection Layer** that operates *before* any data is sent to the AI model.
- **Immediate Interception:** If a user's input contains keywords indicating severe distress, self-harm, or crisis, the system immediately intercepts the message.
- **Pre-empting AI Hallucination:** By intercepting these queries before they reach the AI, we prevent the risk of the LLM generating inappropriate or harmful advice in critical situations.
- **Professional Redirection:** Intercepted messages trigger an immediate, hard-coded response providing actionable emergency contact information (e.g., suicide lifelines, emergency services) and compassionate support.

## Third-Party Integrations

- All communications with our AI providers (e.g., Gemini) are conducted over secure, encrypted channels (HTTPS/TLS).
- We continuously audit our dependencies and AI models for vulnerabilities and compliance with our strict privacy standards.
