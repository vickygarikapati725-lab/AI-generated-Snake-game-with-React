import { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: "DATA_STREAM_01", artist: "SYS.AI.ALPHA", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "MEM_LEAK_02", artist: "SYS.AI.BETA", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "BUFFER_OVERRUN", artist: "SYS.AI.GAMMA", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => {
        console.error("Audio playback failed:", e);
        setIsPlaying(false);
      });
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="w-full max-w-md bg-black border-2 border-[#FF00FF] p-5 shadow-[4px_4px_0px_#00FFFF] font-terminal relative">
      {/* Decorative corner pieces */}
      <div className="absolute top-0 left-0 w-2 h-2 bg-[#00FFFF]"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#00FFFF]"></div>
      
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="flex flex-col gap-2 mb-6 border-b-2 border-[#00FFFF] pb-4">
        <div className="text-[#FF00FF] text-xl uppercase tracking-widest">&gt;&gt; CURRENT_PROCESS: AUDIO.EXE</div>
        <h3 className="text-[#00FFFF] font-pixel text-sm md:text-base truncate uppercase glitch mt-2" data-text={currentTrack.title}>{currentTrack.title}</h3>
        <p className="text-[#FF00FF] text-2xl truncate uppercase mt-1">AUTHOR: {currentTrack.artist}</p>
      </div>
      
      {/* Progress bar */}
      <div className="h-6 w-full bg-black border border-[#00FFFF] mb-6 relative overflow-hidden">
        <div 
          className="h-full bg-[#FF00FF] transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-black font-pixel text-[10px] mix-blend-difference">
          {Math.round(progress)}%
        </div>
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between border border-[#FF00FF] p-2">
          <span className="text-[#00FFFF] uppercase text-xl">&gt; VOL_CTRL</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsMuted(!isMuted)} className="text-[#FF00FF] hover:text-white uppercase font-pixel text-xs">
              {isMuted ? '[MUTE]' : '[ON]'}
            </button>
            <input 
              type="range" 
              min="0" max="1" step="0.01" 
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-32 accent-[#FF00FF] h-2 bg-black border border-[#00FFFF] appearance-none cursor-pointer"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-2">
          <button onClick={prevTrack} className="flex-1 border-2 border-[#00FFFF] text-[#00FFFF] py-3 hover:bg-[#00FFFF] hover:text-black uppercase font-pixel text-xs transition-none">
            [PREV]
          </button>
          <button 
            onClick={togglePlay} 
            className="flex-1 border-2 border-[#FF00FF] text-[#FF00FF] py-3 hover:bg-[#FF00FF] hover:text-black uppercase font-pixel text-xs transition-none"
          >
            {isPlaying ? '[PAUSE]' : '[PLAY]'}
          </button>
          <button onClick={nextTrack} className="flex-1 border-2 border-[#00FFFF] text-[#00FFFF] py-3 hover:bg-[#00FFFF] hover:text-black uppercase font-pixel text-xs transition-none">
            [NEXT]
          </button>
        </div>
      </div>
    </div>
  );
}
