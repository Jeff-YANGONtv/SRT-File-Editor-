"use client";

import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const loginRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (loginRef.current) {
      loginRef.current.innerHTML = "";
    }

    const script = document.createElement('script');
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME || "srtfilecollectbot";
    script.setAttribute('data-telegram-login', botUsername);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '14');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.async = true;

    if (loginRef.current) {
      loginRef.current.appendChild(script);
      setTimeout(() => setIsLoaded(true), 300);
    }

    (window as any).onTelegramAuth = (user: any) => {
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = '/edit';
    };

    return () => {
      if (loginRef.current) loginRef.current.innerHTML = "";
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">

      <div className="absolute top-[-5%] left-[-5%] w-[500px] h-[500px] bg-cyan-900/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">

        <div className="bg-slate-900/50 backdrop-blur-2xl p-8 rounded-[40px] border border-white/6 shadow-2xl shadow-black/60 space-y-7">

          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[28px] flex items-center justify-center border border-white/8 shadow-inner mx-auto">
                <img
                  src="/icons/app-icon.png"
                  alt="Yangon TV Logo"
                  className="w-14 h-14 object-contain"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-cyan-500 p-1.5 rounded-xl border-[3px] border-[#020617]">
                <ShieldCheck className="text-white" size={14} />
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <h1 className="text-2xl font-bold text-white tracking-tight">Staff Access</h1>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-widest flex items-center justify-center gap-1.5">
                <Lock size={11} className="text-cyan-500" /> Authorized Personnel Only
              </p>
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/8 to-transparent" />

          <div className="flex flex-col items-center gap-5 py-2">
            <div
              ref={loginRef}
              className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
            />
            <p className="text-slate-700 text-[11px]">Securely powered by Telegram</p>
          </div>

          <p className="text-center text-slate-700 text-[11px] leading-relaxed">
            By logging in, you agree to Yangon TV internal security protocols.
          </p>
        </div>

        <div className="mt-6 text-center">
          <button className="text-slate-600 hover:text-cyan-500 text-xs flex items-center gap-1.5 mx-auto transition-colors duration-200">
            Contact Technical Director <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}
