"use client";
import { useEffect, useRef } from 'react';

export default function LoginPage() {
  const loginRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute('data-telegram-login', "YOUR_BOT_USERNAME"); // အစ်ကို့ Bot Username ပြင်ပါ
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.async = true;

    if (loginRef.current) loginRef.current.appendChild(script);

    (window as any).onTelegramAuth = (user: any) => {
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = '/edit';
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] text-white">
      <div className="p-10 bg-slate-900/50 backdrop-blur-xl rounded-[40px] border border-white/10 shadow-2xl">
        <h2 className="text-2xl font-bold mb-8 text-center">Admin Access</h2>
        <div ref={loginRef}></div>
      </div>
    </div>
  );
}