import Image from 'next/image';
import { useState } from 'react';

function scoreColor(score) {
  if (score >= 7) return 'text-green-500 dark:text-green-400';
  if (score >= 4) return 'text-amber-500 dark:text-amber-400';
  return 'text-red-500 dark:text-red-400';
}

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function PromptCard({ message, showDelete, showShare, onDelete, onShare }) {
  const [expanded, setExpanded] = useState(false);
  const text = message.promptText || message.prompt || '';
  const truncated = text.length > 240 && !expanded;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700/60 p-4 space-y-3 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-black/20 transition-colors">
      {/* Author row */}
      {message.author && (
        <div className="flex items-center gap-2">
          {message.author.image && (
            <Image
              src={message.author.image}
              alt={message.author.name}
              width={22}
              height={22}
              className="rounded-full ring-1 dark:ring-slate-700"
            />
          )}
          <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
            {message.author.name}
          </span>
          <span className="text-xs text-gray-400 dark:text-slate-600 ml-auto">
            {timeAgo(message.createdAt)}
          </span>
        </div>
      )}

      {/* Prompt text */}
      <p className="text-sm text-gray-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
        {truncated ? text.slice(0, 240) + '…' : text}
      </p>
      {text.length > 240 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-violet-500 dark:text-violet-400 hover:opacity-80 transition-opacity"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2">
        {message.score != null && (
          <span className={`text-xs font-bold ${scoreColor(message.score)}`}>
            {message.score}/10
          </span>
        )}
        {(message.tags || []).map((tag) => (
          <span
            key={tag}
            className="text-xs px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400 dark:border dark:border-violet-500/30"
          >
            {tag}
          </span>
        ))}
        {message.sharedAt && (
          <span className="text-xs text-gray-400 dark:text-slate-600 ml-auto">shared</span>
        )}
      </div>

      {/* Actions */}
      {(showDelete || showShare) && (
        <div className="flex gap-2 pt-1">
          {showShare && !message.sharedAt && (
            <button
              onClick={() => onShare(message)}
              className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Share to Chat →
            </button>
          )}
          {showDelete && (
            <button
              onClick={() => onDelete(message)}
              className="text-xs px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
