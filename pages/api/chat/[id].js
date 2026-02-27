import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/mongodb';
import ChatMessage from '@/models/ChatMessage';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  await dbConnect();
  const msg = await ChatMessage.findById(req.query.id);
  if (!msg) return res.status(404).json({ error: 'Not found' });
  if (msg.userId.toString() !== session.user.id) return res.status(403).json({ error: 'Forbidden' });

  await msg.deleteOne();
  return res.status(200).json({ success: true });
}
