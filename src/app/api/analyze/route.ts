import { NextRequest } from 'next/server';
import sampleResult from '@/lib/sampleMissionResult.json';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SYSTEM_PROMPT = `You are a Daily Mission Designer for young adults living alone for the first time.
Your job is to convert the user's current state into 3 small, realistic missions they can complete today.

Rules:
- Output valid JSON only.
- Do not provide medical, legal, or financial diagnosis.
- Missions must be small enough to complete within 5 to 30 minutes.
- Prefer low-cost actions.
- Consider food, rest, outdoor movement, home care, safety, and light social connection.
- Each mission must include points, proof type, and place search query.
- At least 2 missions should be connectable to a nearby place.
- Keep the tone warm but practical.
- Write all text fields in Korean.`;

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    stateSummary: {
      type: 'OBJECT',
      properties: {
        timeOfDay: { type: 'STRING', enum: ['morning', 'afternoon', 'evening', 'night'] },
        primaryNeed: { type: 'STRING', enum: ['meal', 'rest', 'outdoor', 'homecare', 'social', 'safety'] },
        energyLevel: { type: 'STRING', enum: ['low', 'medium', 'high'] },
        urgency: { type: 'STRING', enum: ['low', 'medium', 'high'] },
        summary: { type: 'STRING' },
      },
      required: ['timeOfDay', 'primaryNeed', 'energyLevel', 'urgency', 'summary'],
    },
    agentPlan: { type: 'ARRAY', items: { type: 'STRING' } },
    missions: {
      type: 'ARRAY',
      minItems: 3,
      maxItems: 3,
      items: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING' },
          description: { type: 'STRING' },
          lifeArea: { type: 'STRING', enum: ['meal', 'rest', 'outdoor', 'homecare', 'social', 'safety'] },
          difficulty: { type: 'STRING', enum: ['easy', 'normal', 'challenge'] },
          estimatedMinutes: { type: 'INTEGER' },
          estimatedCostKRW: { type: 'INTEGER' },
          points: { type: 'INTEGER' },
          proofType: { type: 'STRING', enum: ['self_check', 'photo', 'receipt', 'location', 'text'] },
          proofCriteria: { type: 'ARRAY', items: { type: 'STRING' } },
          steps: { type: 'ARRAY', items: { type: 'STRING' } },
          placeSearchQuery: { type: 'STRING' },
          needsMapSpot: { type: 'BOOLEAN' },
          soloFriendly: { type: 'BOOLEAN' },
          whyThisMission: { type: 'STRING' },
        },
        required: [
          'title', 'description', 'lifeArea', 'difficulty', 'estimatedMinutes',
          'estimatedCostKRW', 'points', 'proofType', 'proofCriteria', 'steps',
          'placeSearchQuery', 'needsMapSpot', 'soloFriendly', 'whyThisMission',
        ],
      },
    },
    safetyNote: { type: 'STRING' },
  },
  required: ['stateSummary', 'agentPlan', 'missions', 'safetyNote'],
};

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!GEMINI_API_KEY) {
    return Response.json(sampleResult);
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
                text: `User state:\n${JSON.stringify(body, null, 2)}\n\nGenerate 3 missions based on this state.`,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
          temperature: 0.7,
        },
      }),
    });

    if (!res.ok) {
      console.error('Gemini API error:', await res.text());
      return Response.json(sampleResult);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return Response.json(sampleResult);
    }

    return Response.json(JSON.parse(text));
  } catch (err) {
    console.error('Gemini error, using fallback:', err);
    return Response.json(sampleResult);
  }
}
