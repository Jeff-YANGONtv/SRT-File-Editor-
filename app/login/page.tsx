"use client";

import { useEffect, useState } from 'react';
import { ShieldCheck, Loader as Loader2, CircleAlert as AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleTelegramLogin = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp;
        tg.ready();

        const user = tg.initDataUnsafe?.user;

        if (!user || !user.id) {
          setErrorMsg("Unable to authenticate with Telegram");
          setLoading(false);
          return;
        }

        const initData = tg.initData;

        const response = await fetch('/api/telegram-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            initData,
            userId: user.id,
            username: user.username || `user_${user.id}`,
            firstName: user.first_name || 'User'
          })
        });

        const result = await response.json();

        if (result.success && result.session) {
          localStorage.setItem('telegram_session', result.session);
          localStorage.setItem('telegram_user', JSON.stringify(user));
          window.location.href = '/edit';
        } else {
          setErrorMsg(result.error || "Authentication failed");
          setLoading(false);
        }
      } else {
        setErrorMsg("Telegram Web App not available");
        setLoading(false);
      }
    } catch (err) {
      setErrorMsg("Connection error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-sans">

      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <div className="bg-slate-900/40 backdrop-blur-3xl p-10 rounded-[45px] border border-white/5 shadow-2xl space-y-8">

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

          <div className="space-y-4">
            {errorMsg && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-400 text-xs font-bold">
                <AlertCircle size={14} />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              onClick={handleTelegramLogin}
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-cyan-900/20 text-white"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.1 8.3l-1.9 9c-.1.6-.6 1-1.2.8l-3.6-1.3-.9 2.7c-.1.4-.4.5-.8.3L8 16l-3 1.4c-.4.2-.8 0-.9-.4l-.7-3.4L2.8 14c-.4-.1-.4-.5 0-.7l14.1-5.4c.3-.1.6.1.6.4z'/%3E%3C/svg%3E" alt="Telegram" className="w-5 h-5" />
                  Sign in with Telegram
                </>
              )}
            </button>
          </div>

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