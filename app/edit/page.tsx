"use client";

import React, { useState, useEffect } from 'react';
import { parseSrt, shiftTime, stringifySrt } from '@/lib/srt-parser';
import { 
  Upload, Save, Clock, Film, Tv, Hash, User, 
  CheckCircle2, Trash2, Eraser, AlertCircle 
} from 'lucide-react';

export default function EditPage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  // Metadata States
  const [contentType, setContentType] = useState<"Movie" | "Series">("Movie");
  const [title, setTitle] = useState("");
  const [season, setSeason] = useState("");
  const [episode, setEpisode] = useState("");
  const [editorName, setEditorName] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setEditorName(user.first_name || "Editor");
    }
  }, []);

  // --- Editing Logic ---

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setTitle(file.name.replace('.srt', ''));
      const reader = new FileReader();
      reader.onload = (ev) => {
        const parsed = parseSrt(ev.target?.result as string);
        setNodes(parsed);
      };
      reader.readAsText(file);
    }
  };

  // တစ်ကြောင်းချင်းစီ ဖျက်ရန်
  const deleteNode = (index: number) => {
    const updatedNodes = [...nodes];
    updatedNodes.splice(index, 1);
    setNodes(updatedNodes);
  };

  // စာကြောင်းအလွတ်တွေ (Blank Lines) အကုန် တစ်ချက်တည်းနဲ့ ဖျက်ရန်
  const clearBlankLines = () => {
    const filtered = nodes.filter(node => 
      node.type !== 'cue' || (node.type === 'cue' && node.data.text.trim() !== "")
    );
    setNodes(filtered);
    alert("စာကြောင်းအလွတ်များအားလုံး ဖျက်ပြီးပါပြီ။");
  };

  const handleSaveToCloud = async () => {
    if (!nodes.length) return alert("ဖိုင်အရင်တင်ပါ");
    setLoading(true);

    try {
      const content = stringifySrt(nodes);
      const blob = new Blob([content], { type: 'text/plain' });
      const finalFileName = contentType === "Series" 
        ? `${title}_S${season}_E${episode}.srt` 
        : `${title}.srt`;
      
      const file = new File([blob], finalFileName);

      // 1. Upload to Telegram via API
      const formData = new FormData();
      formData.append('file', file);
      
      const tgRes = await fetch('/api/upload-to-tg', { method: 'POST', body: formData });
      const tgData = await tgRes.json();

      if (tgData.success) {
        // 2. Save to Google Sheet History
        const sheetData = {
          type: contentType,
          title: title,
          season: contentType === "Series" ? season : "-",
          episode: contentType === "Series" ? episode : "-",
          editor: editorName,
          tg_link: `https://t.me/c/${process.env.NEXT_PUBLIC_TG_CHANNEL_ID}/${tgData.message_id}`
        };

        await fetch(process.env.NEXT_PUBLIC_HISTORY_SHEET_URL!, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sheetData)
        });

        alert("Telegram ရော Google Sheet မှာပါ သိမ်းဆည်းပြီးပါပြီ!");
      }
    } catch (error) {
      console.error(error);
      alert("Error ဖြစ်သွားပါပြီ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 p-6 rounded-[32px] border border-white/5 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Film className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Yangon TV Editor V2</h1>
              <p className="text-xs text-slate-500 flex items-center gap-1 uppercase tracking-widest font-semibold">
                <User size={12} className="text-cyan-500" /> Editor: {editorName}
              </p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={clearBlankLines}
              className="flex-1 md:flex-none bg-slate-800 hover:bg-slate-700 text-white px-5 py-3 rounded-2xl flex items-center justify-center gap-2 transition active:scale-95 border border-white/5"
              title="Delete All Blank Lines"
            >
              <Eraser size={18} /> <span className="hidden md:inline">Clear Blanks</span>
            </button>
            <button 
              onClick={handleSaveToCloud}
              disabled={loading}
              className="flex-[2] md:flex-none bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white px-8 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-cyan-900/20 font-bold"
            >
              {loading ? "Saving..." : <><Save size={18} /> Save to Cloud</>}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar Controls */}
          <aside className="space-y-6">
            <div className="bg-slate-900/40 p-6 rounded-[32px] border border-white/5 space-y-5">
              <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Project Details</h2>
              
              <div className="flex bg-slate-950 p-1 rounded-2xl border border-white/5">
                <button 
                  onClick={() => setContentType("Movie")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition ${contentType === "Movie" ? "bg-cyan-600 text-white shadow-md" : "hover:text-white"}`}
                >
                  <Film size={14} /> MOVIE
                </button>
                <button 
                  onClick={() => setContentType("Series")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition ${contentType === "Series" ? "bg-cyan-600 text-white shadow-md" : "hover:text-white"}`}
                >
                  <Tv size={14} /> SERIES
                </button>
              </div>

              <div className="space-y-3">
                <input 
                  placeholder="Title Name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-cyan-500/50 outline-none transition"
                />
                
                {contentType === "Series" && (
                  <div className="flex gap-2">
                    <input placeholder="SS" value={season} onChange={(e) => setSeason(e.target.value)} className="w-1/2 bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-cyan-500/50 outline-none" />
                    <input placeholder="EP" value={episode} onChange={(e) => setEpisode(e.target.value)} className="w-1/2 bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-cyan-500/50 outline-none" />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/5">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-800 rounded-[24px] cursor-pointer hover:bg-slate-800/20 transition group">
                  <Upload className="text-slate-500 mb-2 group-hover:text-cyan-500 transition" />
                  <span className="text-[10px] text-slate-500 text-center px-4 font-medium uppercase tracking-widest leading-relaxed">
                    {fileName || "Drop SRT File Here"}
                  </span>
                  <input type="file" className="hidden" accept=".srt" onChange={handleFileUpload} />
                </label>
              </div>
            </div>

            <div className="bg-slate-900/40 p-6 rounded-[32px] border border-white/5">
              <h2 className="text-[10px] font-bold text-slate-500 mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
                <Clock size={14} /> Global Time Shift
              </h2>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={offset} 
                  onChange={(e) => setOffset(parseInt(e.target.value))} 
                  className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-sm text-cyan-400 font-mono focus:border-cyan-500/50 outline-none"
                />
                <button 
                  onClick={() => setNodes(shiftTime(nodes, offset))}
                  className="bg-cyan-600 hover:bg-cyan-500 p-3 rounded-xl transition active:scale-90 text-white shadow-lg shadow-cyan-900/20"
                >
                  <CheckCircle2 size={18} />
                </button>
              </div>
            </div>
          </aside>

          {/* Main Editor Canvas */}
          <main className="lg:col-span-3 bg-slate-900/20 rounded-[40px] border border-white/5 h-[80vh] flex flex-col overflow-hidden shadow-2xl backdrop-blur-sm">
            <div className="p-5 border-b border-white/5 bg-slate-900/40 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Hash size={14} /> Subtitle Timeline
              </span>
              <div className="px-4 py-1.5 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">{nodes.filter(n => n.type === 'cue').length} Lines</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {nodes.filter(n => n.type === 'cue').map((node, i) => (
                <div key={i} className="group bg-slate-950/40 p-5 rounded-[24px] border border-white/5 focus-within:border-cyan-500/40 hover:bg-slate-950/60 transition-all duration-300">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-slate-600 font-bold">#{i + 1}</span>
                      <span className="text-[10px] font-mono bg-slate-900 px-3 py-1 rounded-lg border border-white/5 text-slate-400">
                        {new Date(node.data.start).toISOString().substr(11, 8)} ⮕ {new Date(node.data.end).toISOString().substr(11, 8)}
                      </span>
                    </div>
                    <button 
                      onClick={() => deleteNode(nodes.indexOf(node))}
                      className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                      title="Delete this line"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <textarea 
                    className="w-full bg-transparent border-none focus:ring-0 text-slate-200 text-base leading-relaxed p-0 resize-none font-medium custom-scrollbar"
                    rows={2}
                    value={node.data.text}
                    spellCheck="false"
                    onChange={(e) => {
                      const updatedNodes = [...nodes];
                      updatedNodes[updatedNodes.indexOf(node)].data.text = e.target.value;
                      setNodes(updatedNodes);
                    }}
                  />
                </div>
              ))}
              
              {nodes.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-800 space-y-4">
                  <div className="w-20 h-20 border-4 border-slate-800 border-dashed rounded-full flex items-center justify-center animate-spin-slow">
                    <AlertCircle size={32} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-30">No Data Imported</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
                  }
