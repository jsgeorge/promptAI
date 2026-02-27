const MAX_LENGTH = 4000;

export default function PromptForm({ onSubmit, isLoading }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const text = e.target.prompt.value.trim();
        if (text) onSubmit(text);
      }}
    >
      <div className="relative">
        <textarea
          name="prompt"
          rows={6}
          maxLength={MAX_LENGTH}
          placeholder="Enter your prompt here…"
          className="w-full rounded-xl border border-gray-200 dark:border-slate-700/60 bg-gray-50 dark:bg-slate-900/80 px-4 py-3 text-sm resize-none text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 dark:focus:border-violet-500/40 transition-colors"
          onChange={(e) => {
            const counter = e.target.parentElement.querySelector('[data-counter]');
            if (counter) counter.textContent = `${e.target.value.length} / ${MAX_LENGTH}`;
          }}
        />
        <span
          data-counter
          className="absolute bottom-2 right-3 text-xs text-gray-400 dark:text-slate-600 select-none"
        >
          0 / {MAX_LENGTH}
        </span>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold tracking-wide hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Evaluating…
          </>
        ) : (
          'EVALUATE WITH AI →'
        )}
      </button>
    </form>
  );
}
