import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a prompt quality evaluator. Given a user prompt, respond ONLY with a JSON object (no markdown, no explanation) with this exact shape:
{
  "score": <integer 0-10>,
  "clarity": "<low|medium|high>",
  "tags": ["<tag1>", "<tag2>"],
  "suggestions": ["<suggestion1>", "<suggestion2>"],
  "rawEval": "<one sentence overall assessment>"
}
Scoring guide: 0-3 = vague/unusable, 4-6 = average, 7-9 = good, 10 = exceptional.
Tags must be 1-4 lowercase single words chosen only from: coding, creative, analysis, writing, math, science, business, roleplay, translation, other.
Provide 2-3 actionable suggestions for improvement (or note what makes it strong if score >= 8).`;

export async function evaluatePrompt(prompt) {
  const message = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 512,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].text.trim();
  // Strip potential markdown code fences if Claude wraps it anyway
  const json = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  return JSON.parse(json);
}
