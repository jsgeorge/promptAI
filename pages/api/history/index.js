import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/mongodb';
import PromptHistory from '@/models/PromptHistory';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  await dbConnect();
  const userId = session.user.id;

  if (req.method === 'GET') {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      PromptHistory.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      PromptHistory.countDocuments({ userId }),
    ]);

    return res.status(200).json({ items, total, page, limit });
  }

  if (req.method === 'POST') {
    const { prompt, score, clarity, tags, suggestions, rawEval } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const entry = await PromptHistory.create({ userId, prompt, score, clarity, tags, suggestions, rawEval });
    return res.status(201).json(entry);
  }

  res.status(405).end();
}
