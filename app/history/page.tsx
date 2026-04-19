"use client";

import { useEffect, useState } from 'react';
import { Calendar, Film, Tv, User, ExternalLink, Search, Clock } from 'lucide-react';

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_HISTORY_SHEET_URL!);
        const data = await res.json();
        setHistory(data.reverse());
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filtered = history.filter((item) =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-7">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Production History</h1>
            <p className="text-slate-600 text-sm mt-0.5">All subtitle records synced from Google Sheets</p>
          </div>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={15} />
            <input
              placeholder="Search titles..."
              className="w-full sm:w-64 bg-slate-900/60 border border-white/6 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-cyan-500/40 outline-none transition"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <span className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          </div>
        )}

        {!loading && (
          <div className="space-y-3">
            {filtered.map((item, i) => (
              <div
                key={i}
                className="group bg-slate-900/50 border border-white/5 px-5 py-4 rounded-[22px] flex items-center justify-between hover:border-white/10 hover:bg-slate-900/70 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center text-cyan-500 shrink-0 group-hover:bg-slate-700 transition">
                    {item.type === "Movie" ? <Film size={18} /> : <Tv size={18} />}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm leading-tight">{item.title}</h3>
                    <div className="flex flex-wrap gap-3 text-[11px] text-slate-600 mt-1 uppercase tracking-wide">
                      <span className="flex items-center gap-1">
                        <User size={11} className="text-slate-700" /> {item.editor}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={11} className="text-slate-700" />
                        {item.date ? new Date(item.date).toLocaleDateString() : "—"}
                      </span>
                      {item.type === "Series" && (
                        <span className="text-cyan-600 font-bold">
                          S{item.season} / E{item.episode}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <a
                  href={item.telegram_link || item.tg_link}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-slate-800 hover:bg-cyan-500 rounded-xl text-slate-400 hover:text-white transition-all duration-200 shrink-0"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            ))}

            {filtered.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-700">
                <Clock size={32} className="opacity-40" />
                <p className="text-xs font-bold uppercase tracking-widest">No Records Found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
