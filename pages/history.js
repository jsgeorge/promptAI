import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import PromptCard from '@/components/PromptCard';
import ConfirmModal from '@/components/ConfirmModal';

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/');
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    setLoading(true);
    fetch(`/api/history?page=${page}&limit=10`)
      .then((r) => r.json())
      .then((data) => {
        setItems((prev) => page === 1 ? data.items : [...prev, ...data.items]);
        setTotal(data.total);
      })
      .catch(() => setError('Failed to load history'))
      .finally(() => setLoading(false));
  }, [status, page]);

  async function handleDelete(item) {
    const res = await fetch(`/api/history/${item._id}`, { method: 'DELETE' });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i._id !== item._id));
      setTotal((t) => t - 1);
    }
    setToDelete(null);
  }

  async function handleShare(item) {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        promptText: item.prompt,
        score: item.score,
        tags: item.tags,
        historyId: item._id,
      }),
    });
    if (res.ok) {
      setItems((prev) =>
        prev.map((i) => i._id === item._id ? { ...i, sharedAt: new Date().toISOString() } : i)
      );
    }
  }

  if (status === 'loading' || status === 'unauthenticated') return null;

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">
          Prompt History
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          Your saved evaluations. Share any prompt to the chat feed.
        </p>
      </div>

      {error && <p className="text-sm text-red-500 dark:text-red-400 mb-4">{error}</p>}

      {loading && items.length === 0 ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : items.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-dashed border-gray-200 dark:border-slate-800">
          <p className="text-sm text-gray-500 dark:text-slate-500 mb-3">No saved prompts yet.</p>
          <a
            href="/new-prompt"
            className="text-xs px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium hover:opacity-90 transition-opacity"
          >
            Evaluate your first prompt →
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <PromptCard
              key={item._id}
              message={item}
              showDelete
              showShare
              onDelete={() => setToDelete(item)}
              onShare={handleShare}
            />
          ))}

          {items.length < total && (
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={loading}
              className="w-full py-2.5 text-sm text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading…' : 'Load more'}
            </button>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={!!toDelete}
        message="Delete this prompt from your history? This cannot be undone."
        onConfirm={() => handleDelete(toDelete)}
        onCancel={() => setToDelete(null)}
      />
    </Layout>
  );
}
