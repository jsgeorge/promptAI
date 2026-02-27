import { useSession, signIn } from 'next-auth/react';
import { useState } from 'react';
import Layout from '@/components/Layout';
import PromptForm from '@/components/PromptForm';
import EvaluationResult from '@/components/EvaluationResult';

export default function HomePage() {
  const { data: session } = useSession();

  const [evaluation, setEvaluation] = useState(null);
  const [promptText, setPromptText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);
  const [historyId, setHistoryId] = useState(null);
  const [error, setError] = useState('');

  async function handleEvaluate(text) {
    setIsEvaluating(true);
    setError('');
    setEvaluation(null);
    setSaved(false);
    setShared(false);
    setHistoryId(null);
    setPromptText(text);
    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Evaluation failed');
      setEvaluation(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsEvaluating(false);
    }
  }

  async function handleSaveHistory() {
    setIsSaving(true);
    try {
      const res = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText, ...evaluation }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      setHistoryId(data._id);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleShareChat() {
    setIsSharing(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptText,
          score: evaluation.score,
          tags: evaluation.tags,
          historyId: historyId || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to share');
      setShared(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSharing(false);
    }
  }

  return (
    <Layout>
      {/* Hero */}
      <div className="text-center mb-10 pt-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/30 shadow-sm dark:shadow-violet-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400" />
            AI-Powered Tool
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400">
            Free Plan
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
          AI Prompt Evaluator
        </h1>
        <p className="text-gray-500 dark:text-slate-400 text-base max-w-md mx-auto">
          Enter a prompt, get an AI quality score, save it to your history, and share with the community.
        </p>

        {/* CTA buttons — unauthenticated only */}
        {!session && (
          <div className="mt-7 flex items-center justify-center gap-3">
            <button
              onClick={() => signIn('google')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/25 tracking-wide"
            >
              SIGN UP &amp; TRY FOR FREE →
            </button>
            <button
              onClick={() => signIn('google')}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors"
            >
              Sign in
            </button>
          </div>
        )}
      </div>

      {/* Prompt form — authenticated only */}
      {session && (
        <>
          <PromptForm onSubmit={handleEvaluate} isLoading={isEvaluating} />

          {error && (
            <p className="mt-3 text-sm text-red-500 dark:text-red-400">{error}</p>
          )}

          {evaluation && (
            <>
              <EvaluationResult
                evaluation={evaluation}
                onSaveHistory={handleSaveHistory}
                onShareChat={handleShareChat}
                isSaving={isSaving}
                isSharing={isSharing}
                saved={saved}
                shared={shared}
              />
              <button
                onClick={() => {
                  setEvaluation(null);
                  setPromptText('');
                  setSaved(false);
                  setShared(false);
                  setHistoryId(null);
                  setError('');
                }}
                className="mt-4 text-xs text-gray-400 dark:text-slate-600 hover:text-gray-600 dark:hover:text-slate-400 transition-colors"
              >
                ← Clear and start over
              </button>
            </>
          )}
        </>
      )}
    </Layout>
  );
}
