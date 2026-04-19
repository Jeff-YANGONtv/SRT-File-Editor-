"use client";
import { useEffect, useState } from 'react';
import { Calendar, Film, Tv, User, ExternalLink, Search } from 'lucide-react';

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await fetch(process.env.NEXT_PUBLIC_HISTORY_SHEET_URL!);
      const data = await res.json();
      setHistory(data.reverse()); // အသစ်တွေကို အပေါ်ဆုံးမှာ ပြမယ်
    };
    fetchHistory();
  }, []);

  const filtered = history.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white">Production History</h1>
            <p className="text-slate-500 text-sm">Track all subtitle records from Google Sheets</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              placeholder="Search movies..." 
              className="bg-slate-900/50 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-cyan-500 outline-none w-64"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filtered.map((item, i) => (
            <div key={i} className="bg-slate-900/40 border border-white/5 p-6 rounded-[24px] flex items-center justify-between hover:bg-slate-900/60 transition group">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-cyan-500 group-hover:scale-110 transition">
                  {item.type === "Movie" ? <Film size={24} /> : <Tv size={24} />}
                </div>
                <div>
                  <h3 className="text-white font-bold">{item.title}</h3>
                  <div className="flex gap-4 text-[11px] text-slate-500 mt-1 uppercase tracking-wider">
                    <span className="flex items-center gap-1"><User size={12}/> {item.editor}</span>
                    <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(item.date).toLocaleDateString()}</span>
                    {item.type === "Series" && <span className="text-cyan-500 font-bold">S-{item.season} / E-{item.episode}</span>}
                  </div>
                </div>
              </div>
              <a href={item.telegram_link} target="_blank" className="p-3 bg-slate-800 hover:bg-cyan-600 rounded-xl text-white transition">
                <ExternalLink size={20} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
