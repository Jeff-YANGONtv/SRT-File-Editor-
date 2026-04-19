"use client";

import Link from 'next/link';
import { ShieldCheck, ArrowRight, LayoutPanelTop, MonitorPlay } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 md:p-6 text-center relative overflow-hidden">
      
      {/* Background Glows - Responsive Blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[80%] md:w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[100px] md:blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[80%] md:w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[100px] md:blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-3xl relative z-10 space-y-8 md:space-y-12">
        
        {/* Logo Section */}
        <div className="flex justify-center">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[28px] md:rounded-[32px] flex items-center justify-center border border-white/10 shadow-2xl transition-transform hover:scale-105 duration-500">
            {/* အစ်ကို့ Logo ပုံလေး ဒီမှာပေါ်ပါမယ် */}
            <img src="/icons/app-icon.png" alt="Yangon TV" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
          </div>
        </div>

        {/* Text Section */}
        <div className="space-y-4 px-2">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[1.1]">
            YANGON TV <br/>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent italic">
              PRODUCTION LAB
            </span>
          </h1>
          <p className="text-slate-400 text-sm md:text-xl max-w-xl mx-auto font-medium leading-relaxed opacity-80">
            Premium subtitle editing & automated distribution system. <br className="hidden md:block"/>
            Optimized for Yangon TV media workflow.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4 md:pt-6 px-4">
          <Link 
            href="/login" 
            className="group relative inline-flex items-center justify-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white w-full md:w-auto px-10 py-4 md:py-5 rounded-[20px] md:rounded-[24px] font-bold text-base md:text-lg transition-all duration-300 shadow-xl shadow-cyan-900/30 active:scale-95"
          >
            Enter Workspace 
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Feature Tags - Responsive Grid */}
        <div className="pt-10 md:pt-16 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8 max-w-2xl mx-auto opacity-40">
          <div className="flex items-center justify-center gap-2 text-[10px] md:text-xs text-slate-300 uppercase tracking-widest font-bold">
            <ShieldCheck size={14} className="text-cyan-500" /> SECURE LOGIN
          </div>
          <div className="flex items-center justify-center gap-2 text-[10px] md:text-xs text-slate-300 uppercase tracking-widest font-bold">
            <MonitorPlay size={14} className="text-cyan-500" /> V2 ENGINE
          </div>
          <div className="hidden md:flex items-center justify-center gap-2 text-[10px] md:text-xs text-slate-300 uppercase tracking-widest font-bold">
            <LayoutPanelTop size={14} className="text-cyan-500" /> CLOUD SYNC
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-8 left-0 right-0 px-4">
        <p className="text-slate-600 text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.4em] font-bold">
          © 2026 Yangon TV Technical Department
        </p>
      </footer>
    </div>
  );
}