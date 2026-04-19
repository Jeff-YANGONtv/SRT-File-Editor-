"use client";

import React, { useState, useEffect } from 'react';
import { parseSrt, shiftTime, stringifySrt } from '@/lib/srt-parser';
import {
  Upload, Clock, Film, Tv, Hash, User,
  CheckCircle2, Trash2, Eraser, AlertCircle, CloudUpload
} from 'lucide-react';

export default function EditPage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

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

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

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

  const deleteNode = (index: number) => {
    const updated = [...nodes];
    updated.splice(index, 1);
    setNodes(updated);
  };

  const clearBlankLines = () => {
    const filtered = nodes.filter(
      (node) => node.type !== 'cue' || node.data.text.trim() !== ""
    );
    setNodes(filtered);
    showToast("Blank lines cleared.");
  };

  const handleSaveToCloud = async () => {
    if (!nodes.length) return showToast("Please upload a file first.", false);
    setLoading(true);
    try {
      const content = stringifySrt(nodes);
      const blob = new Blob([content], { type: 'text/plain' });
      const finalFileName = contentType === "Series"
        ? `${title}_S${season}_E${episode}.srt`
        : `${title}.srt`;

      const file = new File([blob], finalFileName);
      const formData = new FormData();
      formData.append('file', file);

      const tgRes = await fetch('/api/upload-to-tg', { method: 'POST', body: formData });
      const tgData = await tgRes.json();

      if (tgData.success) {
        const sheetData = {
          type: contentType,
          title,
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

        showToast("Saved to Telegram and Google Sheets!");
      }
    } catch (error) {
      console.error(error);
      showToast("An error occurred. Please try again.", false);
    } finally {
      setLoading(false);
    }
  };

  const cueNodes = nodes.filter((n) => n.type === 'cue');

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-6">

      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-semibold transition-all ${toast.ok ? 'bg-slate-900 border-cyan-500/30 text-white' : 'bg-slate-900 border-red-500/30 text-red-400'}`}>
          <span className={`w-2 h-2 rounded-full ${toast.ok ? 'bg-cyan-400' : 'bg-red-400'}`} />
          {toast.msg}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-5">

        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/50 px-6 py-4 rounded-[28px] border border-white/6 backdrop-blur-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Film className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight leading-tight">Yangon TV Editor V2</h1>
              <p className="text-[11px] text-slate-500 flex items-center gap-1 uppercase tracking-wider font-medium">
                <User size={10} className="text-cyan-500" /> {editorName}
              </p>
            </div>
          </div>
          <div className="flex gap-2.5 w-full sm:w-auto">
            <button
              onClick={clearBlankLines}
              className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all active:scale-95 border border-white/5"
            >
              <Eraser size={16} /> <span className="hidden sm:inline">Clear Blanks</span>
            </button>
            <button
              onClick={handleSaveToCloud}
              disabled={loading}
              className="flex-[2] sm:flex-none bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-500 text-white px-7 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all active:scale-95 shadow-lg shadow-cyan-500/20"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <><CloudUpload size={16} /> Save to Cloud</>
              )}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

          <aside className="space-y-4">

            <div className="bg-slate-900/50 p-5 rounded-[28px] border border-white/6 space-y-4 backdrop-blur-xl">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Project Details</p>

              <div className="flex bg-slate-950 p-1 rounded-2xl border border-white/5">
                <button
                  onClick={() => setContentType("Movie")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${contentType === "Movie" ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20" : "text-slate-500 hover:text-white"}`}
                >
                  <Film size={13} /> MOVIE
                </button>
                <button
                  onClick={() => setContentType("Series")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${contentType === "Series" ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20" : "text-slate-500 hover:text-white"}`}
                >
                  <Tv size={13} /> SERIES
                </button>
              </div>

              <div className="space-y-2.5">
                <input
                  placeholder="Title Name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-white/6 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-cyan-500/40 outline-none transition"
                />
                {contentType === "Series" && (
                  <div className="flex gap-2">
                    <input
                      placeholder="SS"
                      value={season}
                      onChange={(e) => setSeason(e.target.value)}
                      className="w-1/2 bg-slate-950 border border-white/6 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-cyan-500/40 outline-none"
                    />
                    <input
                      placeholder="EP"
                      value={episode}
                      onChange={(e) => setEpisode(e.target.value)}
                      className="w-1/2 bg-slate-950 border border-white/6 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-cyan-500/40 outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="pt-1">
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-800 rounded-2xl cursor-pointer hover:border-cyan-500/40 hover:bg-slate-800/20 transition-all group">
                  <Upload className="text-slate-600 mb-1.5 group-hover:text-cyan-500 transition" size={20} />
                  <span className="text-[10px] text-slate-600 text-center px-3 font-semibold uppercase tracking-widest leading-relaxed group-hover:text-slate-400 transition">
                    {fileName || "Upload SRT File"}
                  </span>
                  <input type="file" className="hidden" accept=".srt" onChange={handleFileUpload} />
                </label>
              </div>
            </div>

            <div className="bg-slate-900/50 p-5 rounded-[28px] border border-white/6 backdrop-blur-xl">
              <p className="text-[10px] font-bold text-slate-600 mb-3.5 uppercase tracking-[0.2em] flex items-center gap-2">
                <Clock size={12} /> Time Shift (ms)
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={offset}
                  onChange={(e) => setOffset(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-white/6 rounded-xl px-4 py-2.5 text-sm text-cyan-400 font-mono focus:border-cyan-500/40 outline-none"
                />
                <button
                  onClick={() => setNodes(shiftTime(nodes, offset))}
                  className="bg-cyan-500 hover:bg-cyan-400 p-2.5 rounded-xl transition-all active:scale-90 text-white shadow-lg shadow-cyan-500/20"
                >
                  <CheckCircle2 size={18} />
                </button>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-3 bg-slate-900/30 rounded-[32px] border border-white/5 h-[78vh] flex flex-col overflow-hidden backdrop-blur-sm">
            <div className="px-5 py-3.5 border-b border-white/5 bg-slate-900/50 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <Hash size={12} /> Subtitle Timeline
              </span>
              <div className="px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">{cueNodes.length} Lines</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
              {cueNodes.map((node, i) => (
                <div
                  key={i}
                  className="group bg-slate-950/50 p-4 rounded-[20px] border border-white/5 focus-within:border-cyan-500/30 hover:border-white/10 transition-all duration-200"
                >
                  <div className="flex justify-between items-center mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-mono text-slate-700 font-bold w-7 text-right">#{i + 1}</span>
                      <span className="text-[10px] font-mono bg-slate-900/80 px-2.5 py-1 rounded-lg border border-white/5 text-slate-500">
                        {new Date(node.data.start).toISOString().substring(11, 23).replace('.', ',')} &rarr; {new Date(node.data.end).toISOString().substring(11, 23).replace('.', ',')}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteNode(nodes.indexOf(node))}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <textarea
                    className="w-full bg-transparent border-none focus:ring-0 text-slate-200 text-sm leading-relaxed p-0 resize-none font-medium outline-none custom-scrollbar"
                    rows={node.data.text.split('\n').length || 1}
                    value={node.data.text}
                    spellCheck="false"
                    onChange={(e) => {
                      const updated = [...nodes];
                      updated[nodes.indexOf(node)] = {
                        ...node,
                        data: { ...node.data, text: e.target.value }
                      };
                      setNodes(updated);
                    }}
                  />
                </div>
              ))}

              {nodes.length === 0 && (
                <div className="h-full min-h-[50vh] flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 border-2 border-dashed border-slate-800 rounded-full flex items-center justify-center animate-spin-slow">
                    <AlertCircle size={24} className="text-slate-700" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-700">No SRT Imported</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
