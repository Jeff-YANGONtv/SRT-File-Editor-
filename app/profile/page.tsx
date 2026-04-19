"use client";
import { useEffect, useState } from 'react';
import { User, LogOut, ShieldCheck, Mail } from 'lucide-react';

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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900/40 border border-white/5 rounded-[48px] p-10 text-center space-y-6 backdrop-blur-xl">
        <div className="relative inline-block">
          <img src={user.photo_url || "/icons/profile-tab.png"} className="w-32 h-32 rounded-full border-4 border-cyan-600 p-1 mx-auto" />
          <div className="absolute bottom-1 right-1 bg-cyan-600 p-2 rounded-full border-4 border-[#020617]">
            <ShieldCheck size={16} className="text-white" />
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-white">{user.first_name} {user.last_name}</h2>
          <p className="text-slate-500 text-sm">@{user.username}</p>
        </div>

        <div className="bg-slate-950/50 rounded-3xl p-4 text-left border border-white/5">
          <div className="flex items-center gap-3 text-sm text-slate-400">
             <Mail size={16} className="text-cyan-600" />
             <span>ID: {user.id}</span>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-4 rounded-2xl font-bold transition flex items-center justify-center gap-2"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </div>
  );
}
