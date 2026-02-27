import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/mongodb';
import ChatMessage from '@/models/ChatMessage';
import PromptHistory from '@/models/PromptHistory';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  await dbConnect();

  if (req.method === 'GET') {
    const since = req.query.since ? new Date(req.query.since) : null;
    const query = since ? { createdAt: { $gt: since } } : {};
    const messages = await ChatMessage.find(query)
      .sort({ createdAt: since ? 1 : -1 })
      .limit(50)
      .lean();
    return res.status(200).json({ messages });
  }

  if (req.method === 'POST') {
    const { promptText, score, tags, historyId } = req.body;
    if (!promptText) return res.status(400).json({ error: 'Prompt text is required' });

    const msg = await ChatMessage.create({
      userId: session.user.id,
      promptText,
      score,
      tags,
      historyId: historyId || null,
      author: { name: session.user.name, image: session.user.image },
    });

    // Mark history entry as shared if provided
    if (historyId) {
      await PromptHistory.findByIdAndUpdate(historyId, { sharedAt: new Date() });
    }

    return res.status(201).json(msg);
  }

  res.status(405).end();
}
