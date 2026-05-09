import { NextRequest } from 'next/server';
import sampleReview from '@/lib/sampleTipReview.json';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SYSTEM_PROMPT = `You are a Life Tip Curator for young adults living alone for the first time.
Your job is to review, improve, and score user-submitted life tips.

Rules:
- Output valid JSON only.
- Do not provide medical, legal, or financial diagnosis.
- Improve the tip to be more specific, actionable, and beginner-friendly.
- Score usefulness from 0 to 100 based on: specificity, cost, practicality, and accessibility.
- Suggest points between 10 and 50.
- Keep the tone warm and encouraging.
- Write all text fields in Korean.`;

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    category: {
      type: 'STRING',
      enum: ['convenience_combo', 'budget', 'homecare', 'safety', 'loneliness', 'cleaning_laundry'],
    },
    improvedTitle: { type: 'STRING' },
    improvedTip: { type: 'STRING' },
    estimatedCostKRW: { type: 'INTEGER' },
    usefulnessScore: { type: 'INTEGER' },
    suggestedPoints: { type: 'INTEGER' },
    whyUseful: { type: 'STRING' },
    tags: { type: 'ARRAY', items: { type: 'STRING' } },
    safetyOrHealthNote: { type: 'STRING' },
  },
  required: [
    'category', 'improvedTitle', 'improvedTip', 'estimatedCostKRW',
    'usefulnessScore', 'suggestedPoints', 'whyUseful', 'tags', 'safetyOrHealthNote',
  ],
};

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!GEMINI_API_KEY) {
    return Response.json(sampleReview);
  }

  try {
    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Review and improve this life tip:\n${JSON.stringify(body, null, 2)}`,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
          temperature: 0.6,
        },
      }),
    });

    if (!res.ok) {
      return Response.json(sampleReview);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) return Response.json(sampleReview);

    return Response.json(JSON.parse(text));
  } catch (err) {
    console.error('Tip review error, using fallback:', err);
    return Response.json(sampleReview);
  }
}
