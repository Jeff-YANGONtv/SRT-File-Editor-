"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Film, Clock, User, LogOut } from 'lucide-react';

interface NavigationProps {
  editorName?: string;
  onLogout?: () => void;
}

export default function Navigation({ editorName = "STAFF", onLogout }: NavigationProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-slate-900/50 border-b border-white/6 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Film className="text-white" size={16} />
            </div>
            <span className="text-sm font-bold text-white hidden sm:inline">Yangon TV Editor</span>
          </div>

          <div className="flex items-center gap-1">
            <Link
              href="/edit"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/edit')
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Film size={16} />
              <span className="hidden sm:inline">Editor</span>
            </Link>

            <Link
              href="/history"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/history')
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Clock size={16} />
              <span className="hidden sm:inline">History</span>
            </Link>

            <Link
              href="/profile"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/profile')
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <User size={16} />
              <span className="hidden sm:inline">Profile</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider hidden sm:inline">
            {editorName}
          </span>
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 bg-slate-800 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg border border-white/5 transition-all"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
