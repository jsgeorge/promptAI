function scoreColor(score) {
  if (score >= 7) return 'text-green-500 dark:text-green-400';
  if (score >= 4) return 'text-amber-500 dark:text-amber-400';
  return 'text-red-500 dark:text-red-400';
}

function clarityBadge(clarity) {
  if (clarity === 'high')
    return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 dark:border dark:border-green-500/30';
  if (clarity === 'medium')
    return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 dark:border dark:border-amber-500/30';
  return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 dark:border dark:border-red-500/30';
}

export default function EvaluationResult({
  evaluation,
  onSaveHistory,
  onShareChat,
  isSaving,
  isSharing,
  saved,
  shared,
}) {
  const { score, clarity, tags = [], suggestions = [], rawEval } = evaluation;

  return (
    <div className="mt-6 rounded-xl border border-gray-200 dark:border-slate-700/60 bg-white dark:bg-slate-900/60 p-5 space-y-4 shadow-sm dark:shadow-black/20">
      {/* Score + clarity */}
      <div className="flex items-center gap-4">
        <div className="text-center leading-none">
          <span className={`text-4xl font-bold ${scoreColor(score)}`}>{score}</span>
          <span className="text-gray-400 dark:text-slate-600 text-lg">/10</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full w-fit ${clarityBadge(clarity)}`}>
            {clarity} clarity
          </span>
          {rawEval && (
            <p className="text-sm text-gray-600 dark:text-slate-400">{rawEval}</p>
          )}
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400 dark:border dark:border-violet-500/30"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">
            Suggestions
          </p>
          <ol className="space-y-1.5 list-decimal list-inside">
            {suggestions.map((s, i) => (
              <li key={i} className="text-sm text-gray-700 dark:text-slate-300">
                {s}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button
          onClick={onSaveHistory}
          disabled={isSaving || saved}
          className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5"
        >
          {saved ? '✓ Saved' : isSaving ? 'Saving…' : 'Save to History'}
        </button>
        <button
          onClick={onShareChat}
          disabled={isSharing || shared}
          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20"
        >
          {shared ? '✓ Shared' : isSharing ? 'Sharing…' : 'Share to Chat →'}
        </button>
      </div>
    </div>
  );
}
