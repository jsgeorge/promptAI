import Navbar from '@/components/Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#07090f] text-gray-900 dark:text-slate-100 transition-colors relative overflow-x-hidden">
      {/* Radial violet glow — visible in dark mode only */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 w-full h-[520px] opacity-0 dark:opacity-100 transition-opacity"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -5%, rgba(124,58,237,0.22) 0%, transparent 70%)',
        }}
      />
      <Navbar />
      <main className="relative max-w-3xl mx-auto px-4 py-10">
        {children}
      </main>
    </div>
  );
}
