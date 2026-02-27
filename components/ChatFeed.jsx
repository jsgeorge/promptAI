import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import PromptCard from '@/components/PromptCard';
import ConfirmModal from '@/components/ConfirmModal';

const POLL_INTERVAL = 5000;

export default function ChatFeed({ showDeleteOwn = false }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState(null);
  const lastSeenRef = useRef(null);

  useEffect(() => {
    fetch('/api/chat')
      .then((r) => r.json())
      .then((data) => {
        setMessages(data.messages || []);
        if (data.messages && data.messages.length > 0) {
          // Initial load is newest-first; the newest timestamp is messages[0]
          lastSeenRef.current = data.messages[0].createdAt;
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const since = lastSeenRef.current;
      if (!since) return;
      fetch(`/api/chat?since=${encodeURIComponent(since)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.messages && data.messages.length > 0) {
            setMessages((prev) => [...data.messages, ...prev]);
            lastSeenRef.current = data.messages[data.messages.length - 1].createdAt;
          }
        });
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  async function handleDelete(msg) {
    const res = await fetch(`/api/chat/${msg._id}`, { method: 'DELETE' });
    if (res.ok) {
      setMessages((prev) => prev.filter((m) => m._id !== msg._id));
    }
    setToDelete(null);
  }

  if (loading) return <p className="text-sm text-slate-500">Loading…</p>;

  if (messages.length === 0) {
    return (
      <div className="text-center py-12 rounded-xl border border-dashed border-gray-200 dark:border-slate-800">
        <p className="text-sm text-gray-500 dark:text-slate-500 mb-3">No prompts shared yet.</p>
        <a
          href="/new-prompt"
          className="text-xs px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium hover:opacity-90 transition-opacity"
        >
          Be the first →
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {messages.map((msg) => (
          <PromptCard
            key={msg._id}
            message={msg}
            showDelete={showDeleteOwn && session?.user?.id === msg.userId}
            showShare={false}
            onDelete={() => setToDelete(msg)}
          />
        ))}
      </div>

      <ConfirmModal
        isOpen={!!toDelete}
        message="Remove this message from the chat? This cannot be undone."
        onConfirm={() => handleDelete(toDelete)}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
