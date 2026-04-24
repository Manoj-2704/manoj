import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, Disc3 } from 'lucide-react';
import { TRACKS } from '../constants';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          // Handle autoplay restrictions gracefully
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    handleNext();
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-fuchsia-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(217,70,239,0.15)] relative overflow-hidden group">
      {/* Decorative background glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-fuchsia-500/20 rounded-full blur-[50px] pointer-events-none transition-opacity duration-1000 group-hover:opacity-100 opacity-50"></div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      {/* Album Art / Visualizer Placeholder */}
      <div className="w-full aspect-square bg-slate-950 rounded-xl mb-6 flex items-center justify-center border border-slate-800 overflow-hidden relative shadow-inner">
        <div className={`absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10 transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-30'}`}></div>
        
        {isPlaying ? (
          <Disc3 className="w-24 h-24 text-fuchsia-400 animate-[spin_4s_linear_infinite] drop-shadow-[0_0_15px_rgba(217,70,239,0.6)]" />
        ) : (
          <Music className="w-24 h-24 text-slate-700 transition-colors duration-500" />
        )}

        {/* Fake EQ bars when playing */}
        {isPlaying && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1 px-8 h-8 items-end opacity-50">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className="w-2 bg-cyan-400 rounded-t-sm animate-pulse"
                style={{ 
                  height: `${Math.random() * 100}%`,
                  animationDuration: `${0.5 + Math.random()}s`,
                  animationDelay: `${Math.random()}s`
                }}
              ></div>
            ))}
          </div>
        )}
      </div>

      {/* Track Info */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-100 truncate drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
          {currentTrack.title}
        </h3>
        <p className="text-sm text-cyan-400 truncate mt-1">
          {currentTrack.artist}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(217,70,239,0.8)]"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-2">
        <button 
          onClick={toggleMute}
          className="p-2 text-slate-400 hover:text-cyan-400 transition-colors focus:outline-none"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrev}
            className="p-2 text-slate-300 hover:text-fuchsia-400 transition-colors focus:outline-none hover:drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]"
            aria-label="Previous track"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="p-4 bg-slate-800 border border-slate-700 rounded-full text-white hover:bg-slate-700 hover:border-cyan-500 transition-all focus:outline-none shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={28} className="fill-current" /> : <Play size={28} className="fill-current ml-1" />}
          </button>
          
          <button 
            onClick={handleNext}
            className="p-2 text-slate-300 hover:text-fuchsia-400 transition-colors focus:outline-none hover:drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]"
            aria-label="Next track"
          >
            <SkipForward size={24} />
          </button>
        </div>

        <div className="w-9"></div> {/* Spacer to balance the mute button */}
      </div>
    </div>
  );
};
