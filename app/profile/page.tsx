"use client";

import { useEffect, useState } from 'react';
import Navigation from '@/app/components/Navigation';
import { LogOut, ShieldCheck, Hash, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleNavigationLogout = () => {
    localStorage.removeItem('telegram_session');
    localStorage.removeItem('telegram_user');
    window.location.href = '/login';
  };

  if (!user) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <span className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col">
      <Navigation editorName={user.first_name || user.username || "STAFF"} onLogout={handleNavigationLogout} />
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-cyan-500/4 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10 space-y-4">

        <Link
          href="/edit"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          <ArrowLeft size={13} /> Back to Editor
        </Link>

        <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/6 rounded-[40px] p-8 space-y-6 shadow-2xl shadow-black/50">

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={user.photo_url || "/icons/profile-tab.png"}
                alt="Profile"
                className="w-24 h-24 rounded-full border-2 border-white/10 object-cover"
              />
              <div className="absolute -bottom-1 -right-1 bg-cyan-500 p-1.5 rounded-full border-2 border-[#020617]">
                <ShieldCheck size={13} className="text-white" />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {user.first_name}{user.last_name ? ` ${user.last_name}` : ""}
              </h2>
              {user.username && (
                <p className="text-slate-500 text-sm mt-0.5">@{user.username}</p>
              )}
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/6 to-transparent" />

          <div className="bg-slate-950/60 rounded-2xl px-4 py-3.5 border border-white/5">
            <div className="flex items-center gap-3 text-sm">
              <Hash size={14} className="text-cyan-500 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold mb-0.5">Telegram ID</p>
                <p className="text-slate-300 font-mono text-xs">{user.id}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500/8 hover:bg-red-500 border border-red-500/20 hover:border-transparent text-red-400 hover:text-white py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
