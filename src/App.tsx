import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00FFFF] flex flex-col items-center justify-center relative overflow-hidden font-terminal selection:bg-[#FF00FF] selection:text-black">
      {/* CRT & Noise Overlays */}
      <div className="scanlines"></div>
      <div className="static-noise"></div>
      
      <div className="z-10 w-full max-w-6xl px-6 py-12 flex flex-col lg:flex-row items-center justify-center gap-16 tear">
        
        {/* Left/Top side: Title & Music Player */}
        <div className="flex flex-col items-center lg:items-start gap-10 w-full max-w-md">
          <div className="text-center lg:text-left border-l-4 border-[#FF00FF] pl-4">
            <h1 className="text-4xl md:text-5xl font-pixel tracking-tighter mb-4 uppercase glitch" data-text="NEON_SNAKE.EXE">
              NEON_SNAKE.EXE
            </h1>
            <p className="text-[#FF00FF] font-terminal text-2xl tracking-widest uppercase mt-4">
              &gt; STATUS: ONLINE
              <br />
              &gt; AUDIO_STREAM: ACTIVE
            </p>
          </div>
          
          <MusicPlayer />
        </div>
        
        {/* Right/Center side: Game */}
        <div className="flex-shrink-0 border-4 border-[#00FFFF] shadow-[8px_8px_0px_#FF00FF]">
          <SnakeGame />
        </div>
        
      </div>
    </div>
  );
}
