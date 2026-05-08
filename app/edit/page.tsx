"use client";

import React, { useState, useEffect, useRef } from 'react';
import { parseSrt, shiftTime, stringifySrt, formatTimestamp } from '@/lib/srt-parser';
import Navigation from '@/app/components/Navigation';
import MXPlayer from '@/app/components/MXPlayer';
import { Upload, Clock, Film, Tv, Hash, CircleCheck as CheckCircle2, Trash2, Eraser, CloudUpload, Music } from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';

export default function EditPage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [fileName, setFileName] = useState("");
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaName, setMediaName] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const [contentType, setContentType] = useState<"Movie" | "Series">("Movie");
  const [title, setTitle] = useState("");
  const [season, setSeason] = useState("");
  const [episode, setEpisode] = useState("");
  const [editorName, setEditorName] = useState("Editor");

  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const checkUser = () => {
      const telegramSession = localStorage.getItem('telegram_session');
      const telegramUser = localStorage.getItem('telegram_user');

      if (telegramSession && telegramUser) {
        try {
          const user = JSON.parse(telegramUser);
          const name = user.first_name || user.username || "STAFF";
          setEditorName(name.toUpperCase());
        } catch {
          window.location.href = '/login';
        }
      } else {
        window.location.href = '/login';
      }
    };
    checkUser();

    if (waveformRef.current && !wavesurfer.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#1e293b',
        progressColor: '#06b6d4',
        cursorColor: '#06b6d4',
        barWidth: 2,
        barRadius: 3,
        height: 50,
        normalize: true,
        interact: true,
      });
    }

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
    };
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

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaName(file.name);
      const url = URL.createObjectURL(file);
      setMediaUrl(url);
      if (wavesurfer.current) {
        wavesurfer.current.load(url);
      }
    }
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
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

  const setStartTime = (index: number) => {
    const updated = [...nodes];
    const nodeIndex = nodes.indexOf(cueNodes[index]);
    updated[nodeIndex] = {
      ...updated[nodeIndex],
      data: { ...updated[nodeIndex].data, start: Math.floor(currentTime) }
    };
    setNodes(updated);
  };

  const setEndTime = (index: number) => {
    const updated = [...nodes];
    const nodeIndex = nodes.indexOf(cueNodes[index]);
    updated[nodeIndex] = {
      ...updated[nodeIndex],
      data: { ...updated[nodeIndex].data, end: Math.floor(currentTime) }
    };
    setNodes(updated);
  };

  const handleSaveToCloud = async () => {
    if (!nodes.length) return showToast("Please upload a file first.", false);
    if (!title.trim()) return showToast("Please enter a title.", false);
    if (contentType === "Series" && (!season.trim() || !episode.trim())) {
      return showToast("Please enter season and episode numbers.", false);
    }

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

      if (!tgRes.ok || !tgData.success) {
        throw new Error(tgData.error || 'Failed to upload to Telegram');
      }

      showToast("✅ Saved successfully!");
    } catch (error: any) {
      showToast(error.message || "An error occurred", false);
    } finally {
      setLoading(false);
    }
  };

  const cueNodes = nodes.filter((n) => n.type === 'cue');

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 flex flex-col font-sans selection:bg-cyan-500/30">
      <Navigation editorName={editorName} onLogout={() => {}} />
      
      <div className="flex-1 p-4 lg:p-8 max-w-[1600px] mx-auto w-full space-y-6">
        {toast && (
          <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4">
            <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl ${toast.ok ? 'bg-slate-900/90 border-cyan-500/30 text-white' : 'bg-slate-900/90 border-red-500/30 text-red-400'}`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${toast.ok ? 'bg-cyan-400' : 'bg-red-400'}`} />
              <span className="text-sm font-bold tracking-wide">{toast.msg}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column: Video & Waveform */}
          <div className="flex-1 space-y-6">
            {/* MX Player */}
            <MXPlayer url={mediaUrl} onTimeUpdate={handleTimeUpdate} />

            {/* Waveform */}
            {mediaUrl && (
              <div className="bg-slate-900/40 rounded-[32px] border border-white/5 overflow-hidden backdrop-blur-md p-6 shadow-2xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Audio Waveform</p>
                <div ref={waveformRef} className="w-full bg-slate-950/50 rounded-2xl overflow-hidden border border-white/5" />
              </div>
            )}

            {/* Project Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/40 p-6 rounded-[28px] border border-white/5 backdrop-blur-md">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Project Type</p>
                <div className="flex bg-slate-950/50 p-1.5 rounded-2xl border border-white/5">
                  <button onClick={() => setContentType("Movie")} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all ${contentType === "Movie" ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" : "text-slate-500 hover:text-white"}`}>MOVIE</button>
                  <button onClick={() => setContentType("Series")} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all ${contentType === "Series" ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" : "text-slate-500 hover:text-white"}`}>SERIES</button>
                </div>
              </div>
              <div className="bg-slate-900/40 p-6 rounded-[28px] border border-white/5 backdrop-blur-md">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Time Shift (ms)</p>
                <div className="flex gap-3">
                  <input type="number" value={offset} onChange={(e) => setOffset(parseInt(e.target.value) || 0)} className="flex-1 bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-cyan-400 font-mono focus:border-cyan-500/50 outline-none" />
                  <button onClick={() => setNodes(shiftTime(nodes, offset))} className="bg-cyan-500 hover:bg-cyan-400 p-3.5 rounded-xl text-white shadow-lg shadow-cyan-500/20 transition-all active:scale-90"><CheckCircle2 size={20} /></button>
                </div>
              </div>
            </div>

            {/* Media Upload */}
            <div className="bg-slate-900/40 p-6 rounded-[28px] border border-white/5 backdrop-blur-md">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Media</p>
              <label className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 text-slate-200 px-5 py-3 rounded-2xl cursor-pointer transition-all text-xs font-black uppercase tracking-widest border border-white/5 shadow-lg w-fit">
                <Music size={16} /> {mediaName ? "Change Media" : "Load Media"}
                <input type="file" className="hidden" accept="audio/*,video/*" onChange={handleMediaUpload} />
              </label>
            </div>
          </div>

          {/* Right Column: Subtitle Editor */}
          <div className="w-full lg:w-[450px] flex flex-col bg-slate-900/40 rounded-[32px] border border-white/5 backdrop-blur-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 bg-slate-900/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center border border-cyan-500/20">
                  <Hash size={18} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Timeline</p>
                  <p className="text-sm font-bold text-white">{cueNodes.length} Cues</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={clearBlankLines} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all border border-white/5"><Eraser size={18} /></button>
                <button onClick={handleSaveToCloud} disabled={loading} className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-cyan-500/20 transition-all active:scale-95">
                  {loading ? "..." : "Save"}
                </button>
              </div>
            </div>

            {/* SRT Upload */}
            <div className="p-6 border-b border-white/5">
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-800 rounded-2xl cursor-pointer hover:border-cyan-500/40 hover:bg-slate-800/20 transition-all group">
                <Upload className="text-slate-600 mb-1.5 group-hover:text-cyan-500 transition" size={20} />
                <span className="text-[10px] text-slate-600 text-center px-3 font-semibold uppercase tracking-widest leading-relaxed group-hover:text-slate-400 transition">
                  {fileName || "Upload SRT File"}
                </span>
                <input type="file" className="hidden" accept=".srt" onChange={handleFileUpload} />
              </label>
            </div>

            {/* Subtitle List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {cueNodes.length > 0 ? cueNodes.map((node, i) => (
                <div key={i} className="group bg-slate-950/40 p-5 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-700 w-6">#{i + 1}</span>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setStartTime(i)} className="text-[10px] font-mono bg-slate-900 px-2.5 py-1.5 rounded-lg border border-white/5 text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">{formatTimestamp(node.data.start)}</button>
                        <span className="text-slate-800 text-xs">→</span>
                        <button onClick={() => setEndTime(i)} className="text-[10px] font-mono bg-slate-900 px-2.5 py-1.5 rounded-lg border border-white/5 text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">{formatTimestamp(node.data.end)}</button>
                      </div>
                    </div>
                    <button onClick={() => deleteNode(nodes.indexOf(node))} className="opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={14} /></button>
                  </div>
                  <textarea
                    className="w-full bg-transparent border-none focus:ring-0 text-slate-200 text-sm leading-relaxed p-0 resize-none font-medium outline-none"
                    rows={node.data.text.split('\n').length || 1}
                    value={node.data.text}
                    onChange={(e) => {
                      const updated = [...nodes];
                      updated[nodes.indexOf(node)] = { ...node, data: { ...node.data, text: e.target.value } };
                      setNodes(updated);
                    }}
                  />
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20 py-20">
                  <Upload size={48} />
                  <p className="text-xs font-black uppercase tracking-[0.3em]">Import SRT File</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
