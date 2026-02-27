import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import ChatFeed from '@/components/ChatFeed';

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/');
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated') return null;

  async function handlePost(e) {
    e.preventDefault();
    const prompt = text.trim();
    if (!prompt) return;
    setPosting(true);
    setError('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptText: prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to share');
      setText('');
      // Feed will pick it up on next poll
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">
          Chat
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          Share a prompt directly, or use{' '}
          <a href="/new-prompt" className="text-violet-600 dark:text-violet-400 hover:opacity-80 transition-opacity">
            New Prompt
          </a>{' '}
          for AI evaluation first.
        </p>
      </div>

      {/* Quick-post form */}
      <form onSubmit={handlePost} className="mb-8">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          maxLength={4000}
          placeholder="Share a prompt directly to chat…"
          className="w-full rounded-xl border border-gray-200 dark:border-slate-700/60 bg-gray-50 dark:bg-slate-900/80 px-4 py-3 text-sm resize-none text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 dark:focus:border-violet-500/40 transition-colors"
        />
        {error && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={posting || !text.trim()}
          className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity shadow-md shadow-orange-500/20"
        >
          {posting ? 'Sharing…' : 'Share →'}
        </button>
      </form>

      <ChatFeed showDeleteOwn />
    </Layout>
  );
}
