"use client";

export default function TopBar() {
  return (
    <header className="fixed left-64 right-0 top-0 z-30 border-b border-slate-700 bg-slate-800/95 backdrop-blur supports-[backdrop-filter]:bg-slate-800/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2 text-sm text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-white">
            <span className="text-xl">🔔</span>
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          {/* Theme toggle (placeholder) */}
          <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-white">
            <span className="text-xl">🌙</span>
          </button>
        </div>
      </div>
    </header>
  );
}
