export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700/60 p-6 w-full max-w-sm mx-4 shadow-2xl dark:shadow-black/40">
        <p className="text-sm text-gray-700 dark:text-slate-300 mb-5 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
