import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/mongodb';
import PromptHistory from '@/models/PromptHistory';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  await dbConnect();
  const entry = await PromptHistory.findById(req.query.id);
  if (!entry) return res.status(404).json({ error: 'Not found' });
  if (entry.userId.toString() !== session.user.id) return res.status(403).json({ error: 'Forbidden' });

  await entry.deleteOne();
  return res.status(200).json({ success: true });
}
