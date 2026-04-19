"use client";

import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const loginRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // အရင်ရှိနေတဲ့ widget အဟောင်းကို ရှင်းထုတ်တာ (Duplicate မဖြစ်အောင်)
    if (loginRef.current) {
      loginRef.current.innerHTML = "";
    }

    // Telegram Script ကို Create လုပ်ခြင်း
    const script = document.createElement('script');
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    
    // Environment Variable ထဲက Bot Username ကို သုံးမယ် (မရှိရင် Placeholder သုံးမယ်)
    const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME || "YangonTV_Editor_Bot";
    
    script.setAttribute('data-telegram-login', botUsername);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '16');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.async = true;

    if (loginRef.current) {
      loginRef.current.appendChild(script);
      setIsLoaded(true);
    }

    // Login အောင်မြင်ရင် လုပ်ဆောင်မည့် Global Function
    (window as any).onTelegramAuth = (user: any) => {
      // User data ကို localStorage ထဲသိမ်းမယ် (Edit page မှာ ပြန်သုံးဖို့)
      localStorage.setItem('user', JSON.stringify(user));
      // Editor Page ကို လွှတ်လိုက်မယ်
      window.location.href = '/edit';
    };

    return () => {
      // Cleanup function
      if (loginRef.current) loginRef.current.innerHTML = "";
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Glow Effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative">
        <div className="bg-slate-900/40 backdrop-blur-3xl p-10 rounded-[48px] border border-white/5 shadow-2xl space-y-8">
          
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[32px] flex items-center justify-center border border-white/10 shadow-inner group">
                <img 
                  src="/icons/app-icon.png" 
                  alt="Yangon TV Logo" 
                  className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-cyan-600 p-2 rounded-xl border-4 border-[#020617]">
                <ShieldCheck className="text-white" size={16} />
              </div>
            </div>
            
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-white tracking-tight">Staff Access</h1>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-widest flex items-center justify-center gap-2">
                <Lock size={12} className="text-cyan-600" /> Authorized Only
              </p>
            </div>
          </div>

          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

          {/* Telegram Widget Area */}
          <div className="flex flex-col items-center gap-6 py-4">
            <div 
              ref={loginRef} 
              className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              {/* Widget will render here */}
            </div>
            
            <div className="flex items-center gap-2 text-slate-600 text-xs">
              <span>Securely powered by Telegram API</span>
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-center text-slate-600 text-[11px] leading-relaxed">
            By logging in, you agree to the Yangon TV internal security protocols. <br/>
            Your activity will be logged for quality assurance.
          </p>
        </div>

        {/* Support Link */}
        <div className="mt-8 text-center">
          <button className="text-slate-500 hover:text-cyan-500 text-xs flex items-center gap-2 mx-auto transition-colors">
            Contact Technical Director <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
