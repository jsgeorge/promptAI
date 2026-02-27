import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { evaluatePrompt } from '@/lib/claudeClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  if (prompt.length > 4000) {
    return res.status(400).json({ error: 'Prompt exceeds 4000 character limit' });
  }

  try {
    const result = await evaluatePrompt(prompt.trim());
    return res.status(200).json(result);
  } catch (err) {
    console.error('Evaluation error:', err);
    return res.status(500).json({ error: 'Evaluation failed' });
  }
}
