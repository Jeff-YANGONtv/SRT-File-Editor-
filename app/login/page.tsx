"use client";

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

// Supabase Client Initialization
// ⚠️ Vercel Environment Variables မှာ ဒီ Key တွေ ထည့်ထားဖို့ လိုပါတယ်
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
      } else if (data.user) {
        // Login အောင်မြင်ရင် User Info ကို localStorage သိမ်းပြီး Edit Page သွားမယ်
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/edit';
      }
    } catch (err) {
      setErrorMsg("Connection error. Please check your network.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Visual Enhancements (Glows) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <div className="bg-slate-900/40 backdrop-blur-3xl p-10 rounded-[45px] border border-white/5 shadow-2xl space-y-8">
          
          {/* Logo & Header */}
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[28px] flex items-center justify-center border border-white/10 shadow-xl mx-auto">
                <img src="/icons/app-icon.png" alt="Logo" className="w-12 h-12 object-contain" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-cyan-500 p-1.5 rounded-xl border-[3px] border-[#020617]">
                <ShieldCheck className="text-white" size={14} />
              </div>
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-white tracking-tight">Production Lab</h1>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Authorized Personnel Only</p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-4 text-slate-500 group-focus-within:text-cyan-500 transition-colors" size={18} />
              <input 
                type="email" 
                placeholder="Staff Email" 
                required
                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-cyan-500/50 transition-all text-sm text-white"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="relative group">
              <Lock className="absolute left-4 top-4 text-slate-500 group-focus-within:text-cyan-500 transition-colors" size={18} />
              <input 
                type="password" 
                placeholder="Access Key" 
                required
                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-cyan-500/50 transition-all text-sm text-white"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Error Message Display */}
            {errorMsg && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-400 text-xs font-bold">
                <AlertCircle size={14} />
                <span>{errorMsg}</span>
              </div>
            )}

            <button 
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-cyan-900/20 text-white"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <><ShieldCheck size={18} /> Verify Identity <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <footer className="text-center">
            <p className="text-slate-600 text-[9px] font-medium tracking-widest uppercase italic leading-relaxed">
              Security Protocol V2.0 <br/>
              Yangon TV Technical Department
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}