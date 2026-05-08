"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Settings, SkipBack, SkipForward, Lock, Unlock } from 'lucide-react';

interface MXPlayerProps {
  url: string | null;
  onTimeUpdate?: (time: number) => void;
  onDurationChange?: (duration: number) => void;
}

export default function MXPlayer({ url, onTimeUpdate, onDurationChange }: MXPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLocked, setIsLocked] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const lastTouchTime = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onTimeUpdate?.(video.currentTime * 1000);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      onDurationChange?.(video.duration * 1000);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [onTimeUpdate, onDurationChange]);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '00:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || isLocked) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = percent * duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
      if (value > 0 && isMuted) setIsMuted(false);
    }
  };

  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setBrightness(value);
    if (videoRef.current) {
      videoRef.current.style.filter = `brightness(${value}%) contrast(${contrast}%)`;
    }
  };

  const handleContrastChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setContrast(value);
    if (videoRef.current) {
      videoRef.current.style.filter = `brightness(${brightness}%) contrast(${value}%)`;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!videoRef.current || isLocked) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndTime = Date.now();
    
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;
    const deltaTime = touchEndTime - touchStartTime.current;

    // Swipe detection
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50 && deltaTime < 300) {
      // Horizontal swipe - seek
      const seekAmount = (deltaX / 300) * 10; // 10 seconds per swipe
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seekAmount));
    } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50 && deltaTime < 300) {
      // Vertical swipe - volume or brightness
      if (touchStartX.current < window.innerWidth / 2) {
        // Left side - brightness
        const brightnessChange = (deltaY / 100) * -10;
        setBrightness(Math.max(0, Math.min(200, brightness + brightnessChange)));
      } else {
        // Right side - volume
        const volumeChange = (deltaY / 100) * -0.1;
        const newVolume = Math.max(0, Math.min(1, volume + volumeChange));
        setVolume(newVolume);
        if (videoRef.current) {
          videoRef.current.volume = newVolume;
        }
      }
    }

    // Double tap detection
    if (deltaTime < 300 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      if (Date.now() - lastTouchTime.current < 300) {
        togglePlay();
      }
      lastTouchTime.current = Date.now();
    }
  };

  const hideControlsAfterDelay = () => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !isLocked) setShowControls(false);
    }, 3000);
  };

  const handleMouseMove = () => {
    hideControlsAfterDelay();
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };

  const changeSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSpeedMenu(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black rounded-2xl overflow-hidden group"
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="aspect-video relative">
        {url ? (
          <video
            ref={videoRef}
            src={url}
            className="w-full h-full"
            onClick={togglePlay}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600">
            <p className="text-sm font-bold">No video loaded</p>
          </div>
        )}

        {/* Center Play Button */}
        {!isPlaying && url && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center hover:bg-black/20 transition-all"
          >
            <div className="w-20 h-20 bg-cyan-500/80 hover:bg-cyan-500 rounded-full flex items-center justify-center shadow-2xl transition-all">
              <Play size={40} className="text-white fill-white ml-1" />
            </div>
          </button>
        )}

        {/* Controls */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLocked(!isLocked)}
                className="text-white hover:text-cyan-400 transition-colors"
              >
                {isLocked ? <Lock size={20} /> : <Unlock size={20} />}
              </button>
            </div>
            <div className="text-white text-sm font-bold">{formatTime(currentTime)} / {formatTime(duration)}</div>
          </div>

          {/* Center Controls */}
          <div className="absolute inset-0 flex items-center justify-center gap-8 pointer-events-none">
            <button
              onClick={skipBackward}
              className="pointer-events-auto p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
            >
              <SkipBack size={24} />
            </button>
            <button
              onClick={togglePlay}
              className="pointer-events-auto p-4 bg-cyan-500 hover:bg-cyan-400 rounded-full text-white shadow-lg transition-all"
            >
              {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} className="ml-1" fill="currentColor" />}
            </button>
            <button
              onClick={skipForward}
              className="pointer-events-auto p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
            >
              <SkipForward size={24} />
            </button>
          </div>

          {/* Bottom Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
            {/* Progress Bar */}
            <div
              onClick={handleProgressClick}
              className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer hover:h-2 transition-all group/progress"
            >
              <div
                className="h-full bg-cyan-500 rounded-full relative"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-500 rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Play/Pause */}
                <button onClick={togglePlay} className="text-white hover:text-cyan-400 transition-colors">
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>

                {/* Volume */}
                <div className="flex items-center gap-2 group/volume">
                  <button onClick={toggleMute} className="text-white hover:text-cyan-400 transition-colors">
                    {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-0 group-hover/volume:w-24 transition-all h-1 bg-white/20 rounded-full cursor-pointer"
                  />
                </div>

                {/* Time */}
                <span className="text-white text-xs font-bold ml-2">{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Speed */}
                <div className="relative group/speed">
                  <button
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className="text-white hover:text-cyan-400 transition-colors text-xs font-bold px-2 py-1 bg-white/10 rounded"
                  >
                    {playbackSpeed}x
                  </button>
                  {showSpeedMenu && (
                    <div className="absolute bottom-full right-0 mb-2 bg-slate-900 rounded-lg shadow-xl overflow-hidden z-50">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => changeSpeed(speed)}
                          className={`block w-full px-4 py-2 text-sm text-white hover:bg-cyan-500 transition-colors ${
                            playbackSpeed === speed ? 'bg-cyan-500' : ''
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Settings */}
                <div className="relative group/settings">
                  <button className="text-white hover:text-cyan-400 transition-colors p-1">
                    <Settings size={20} />
                  </button>
                  <div className="absolute bottom-full right-0 mb-2 bg-slate-900 rounded-lg shadow-xl overflow-hidden z-50 hidden group-hover/settings:block min-w-[250px]">
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="text-white text-xs font-bold block mb-2">Brightness</label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={brightness}
                          onChange={handleBrightnessChange}
                          className="w-full h-1 bg-white/20 rounded-full cursor-pointer"
                        />
                        <span className="text-white text-xs">{brightness}%</span>
                      </div>
                      <div>
                        <label className="text-white text-xs font-bold block mb-2">Contrast</label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={contrast}
                          onChange={handleContrastChange}
                          className="w-full h-1 bg-white/20 rounded-full cursor-pointer"
                        />
                        <span className="text-white text-xs">{contrast}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fullscreen */}
                <button onClick={toggleFullscreen} className="text-white hover:text-cyan-400 transition-colors">
                  {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
