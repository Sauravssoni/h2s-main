// PrepBuddy — AI Integration (server-side only)
// Uses Gemini API if GEMINI_API_KEY is set; otherwise returns null for fallback.

import type { StudentCheckInInput, WellnessPlan } from './types';
import { assertServerOnly } from './security';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const AI_TIMEOUT_MS = 8_000;

/** Returns an AI-enhanced plan or null (triggering fallback) */
export async function getAIPlan(
  input: StudentCheckInInput,
): Promise<Partial<WellnessPlan> | null> {
  assertServerOnly();

  if (!GEMINI_API_KEY) return null;

  const prompt = buildPrompt(input);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1200,
            responseMimeType: 'application/json',
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ],
        }),
      },
    );

    clearTimeout(timeout);

    if (!response.ok) return null;

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };

    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    const parsed = safeParseAIResponse(rawText);
    return parsed;
  } catch {
    // Timeout, network error, parse error → always use fallback
    return null;
  }
}

function buildPrompt(input: StudentCheckInInput): string {
  return `You are PrepBuddy, an exam-season wellness support tool for Indian students. 
You are NOT a therapist or doctor. You provide practical, safe, student-friendly support.

Student check-in data:
- Exam: ${input.examType} | Phase: ${input.examPhase}
- Mood: ${input.mood} | Stress: ${input.stressLevel}/10 | Anxiety: ${input.anxietyLevel}/10
- Energy: ${input.energyLevel}/10 | Sleep: ${input.sleepQuality}/10 | Focus: ${input.focusLevel}/10 | Confidence: ${input.confidenceLevel}/10
- Triggers: ${input.triggers.join(', ') || 'None selected'}
- Reflection: "${input.reflection || 'Not provided'}"

IMPORTANT RULES:
1. Do NOT diagnose anxiety/depression
2. Do NOT claim to be a therapist
3. Do NOT provide medical advice
4. Keep language supportive, realistic, student-friendly
5. If reflection contains any self-harm themes, only say: "Please reach out to a trusted adult or counsellor immediately."
6. Return ONLY valid JSON, no markdown fencing.

Return JSON with ONLY these fields (strings only, no nested objects):
{
  "reflectionInsight": "2-3 sentence supportive insight about their reflection",
  "examPhaseProtocol": "1-2 sentence phase-specific advice for ${input.examPhase}"
}`;
}

function safeParseAIResponse(raw: string): Partial<WellnessPlan> | null {
  try {
    // Strip potential markdown fences
    const cleaned = raw
      .replace(/^```json\n?/, '')
      .replace(/\n?```$/, '')
      .trim();

    const parsed = JSON.parse(cleaned) as Record<string, unknown>;

    // Only accept known safe string fields
    const result: Partial<WellnessPlan> = {};

    if (typeof parsed.reflectionInsight === 'string') {
      result.reflectionInsight = parsed.reflectionInsight.slice(0, 500);
    }
    if (typeof parsed.examPhaseProtocol === 'string') {
      result.examPhaseProtocol = parsed.examPhaseProtocol.slice(0, 300);
    }

    return Object.keys(result).length > 0 ? result : null;
  } catch {
    return null;
  }
}
