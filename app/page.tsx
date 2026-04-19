import Link from 'next/link';
import { ShieldCheck, ArrowRight, LayoutPanelTop, MonitorPlay } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/20 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-3xl relative z-10 space-y-8">
        
        {/* Logo Section */}
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[32px] flex items-center justify-center border border-white/10 shadow-2xl">
            <img src="/icons/app-icon.png" alt="Yangon TV" className="w-16 h-16 object-contain" />
          </div>
        </div>

        {/* Text Section */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
            YANGON TV <br/>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent italic">
              PRODUCTION LAB
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto font-medium leading-relaxed">
            Premium subtitle editing & automated distribution system. <br/>
            Optimized for Yangon TV media workflow.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-8">
          <Link 
            href="/login" 
            className="group relative inline-flex items-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white px-12 py-5 rounded-[24px] font-bold text-lg transition-all duration-300 shadow-xl shadow-cyan-900/30 active:scale-95"
          >
            Enter Workspace 
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Feature Tags */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto opacity-50">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-300 uppercase tracking-widest font-bold">
            <ShieldCheck size={14} className="text-cyan-500" /> SECURE LOGIN
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-300 uppercase tracking-widest font-bold">
            <MonitorPlay size={14} className="text-cyan-500" /> V2 ENGINE
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-300 uppercase tracking-widest font-bold hidden md:flex">
            <LayoutPanelTop size={14} className="text-cyan-500" /> CLOUD SYNC
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-8 left-0 right-0">
        <p className="text-slate-600 text-[10px] uppercase tracking-[0.4em] font-bold">
          © 2026 Yangon TV Technical Department
        </p>
      </footer>
    </div>
  );
}