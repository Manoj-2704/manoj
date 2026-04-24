import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-mono selection:bg-fuchsia-500/30 flex flex-col relative overflow-hidden">
      
      {/* Global Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Glowing orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <header className="w-full p-6 flex justify-center items-center border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 shadow-lg">
        <h1 className="text-3xl md:text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
          NEON_SERPENT
        </h1>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col xl:flex-row items-center justify-center gap-8 lg:gap-16 p-4 md:p-8 relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Game Section */}
        <section className="flex-shrink-0 w-full max-w-[500px] flex justify-center">
          <SnakeGame />
        </section>

        {/* Music Player Section */}
        <section className="flex-shrink-0 w-full max-w-md xl:w-96 flex flex-col justify-center">
          <div className="mb-4 px-2">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse shadow-[0_0_5px_rgba(217,70,239,0.8)]"></span>
              Audio Interface
            </h2>
          </div>
          <MusicPlayer />
        </section>

      </main>
      
      {/* Footer */}
      <footer className="w-full p-4 text-center text-xs text-slate-600 relative z-10 bg-slate-950/50 backdrop-blur-sm">
        <p>System v1.0.0 // Initialize sequence complete.</p>
      </footer>
    </div>
  );
}
