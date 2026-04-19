"use client";

import Link from 'next/link';
import { ShieldCheck, ArrowRight, LayoutPanelTop, MonitorPlay, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-cyan-500/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[500px] h-[500px] bg-blue-800/8 rounded-full blur-[130px] pointer-events-none" />

      <div className="w-full max-w-xl relative z-10 space-y-10">

        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900/80 rounded-3xl flex items-center justify-center border border-white/8 shadow-2xl shadow-black/60">
              <img src="/icons/app-icon.png" alt="Yangon TV" className="w-12 h-12 object-contain" />
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 bg-cyan-500 p-1.5 rounded-xl border-2 border-[#020617]">
              <Zap size={11} className="text-white" fill="white" />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-semibold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
            Production System Active
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-[1.05]">
            YANGON TV
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
              SUBTITLE LAB
            </span>
          </h1>
          <p className="text-slate-400 text-base max-w-sm mx-auto leading-relaxed">
            Professional subtitle editing and automated cloud distribution for the Yangon TV media workflow.
          </p>
        </div>

        <Link
          href="/login"
          className="group inline-flex items-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-white px-10 py-4 rounded-2xl font-bold text-base transition-all duration-200 shadow-xl shadow-cyan-500/20 active:scale-95"
        >
          Enter Workspace
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
        </Link>

        <div className="pt-4 border-t border-white/5 flex items-center justify-center gap-8 flex-wrap">
          {[
            { icon: ShieldCheck, label: 'Secure Login' },
            { icon: MonitorPlay, label: 'V2 Engine' },
            { icon: LayoutPanelTop, label: 'Cloud Sync' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-slate-600 text-xs uppercase tracking-widest font-semibold">
              <Icon size={13} className="text-cyan-700" />
              {label}
            </div>
          ))}
        </div>
      </div>

      <footer className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-slate-700 text-[10px] uppercase tracking-[0.3em] font-semibold">
          2026 Yangon TV Technical Department
        </p>
      </footer>
    </div>
  );
}
