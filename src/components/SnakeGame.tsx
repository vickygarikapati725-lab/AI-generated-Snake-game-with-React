import { useState, useEffect, useRef } from 'react';

const GRID_SIZE = 20;
const TICK_RATE = 150;

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const directionRef = useRef(direction);
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys and space
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
      
      if (e.key === ' ') {
        setIsPaused(p => !p);
        return;
      }
      
      const { x, y } = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y === 0) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y === 0) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x === 0) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x === 0) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Game loop
  useEffect(() => {
    if (gameOver || isPaused) return;
    
    const moveSnake = () => {
      setSnake(prev => {
        const head = prev[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y
        };
        
        // Check collision with walls
        if (
          newHead.x < 0 || 
          newHead.x >= GRID_SIZE || 
          newHead.y < 0 || 
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prev;
        }
        
        // Check collision with self
        if (prev.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }
        
        const newSnake = [newHead, ...prev];
        
        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
          });
        } else {
          newSnake.pop();
        }
        
        return newSnake;
      });
    };
    
    const intervalId = setInterval(moveSnake, TICK_RATE);
    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    directionRef.current = { x: 0, y: -1 };
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood({
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    });
  };

  return (
    <div className="flex flex-col items-center bg-black p-4 font-terminal w-full max-w-[440px]">
      <div className="mb-4 flex w-full justify-between items-end border-b-2 border-[#FF00FF] pb-2">
        <div className="text-[#00FFFF] font-pixel text-sm md:text-base">
          SCORE:{score.toString().padStart(4, '0')}
        </div>
        <div className="text-[#FF00FF] font-pixel text-xs md:text-sm uppercase animate-pulse">
          {isPaused ? 'SYS.PAUSED' : 'SYS.ACTIVE'}
        </div>
      </div>
      
      <div 
        className="relative bg-black border-2 border-[#00FFFF] overflow-hidden"
        style={{ width: 400, height: 400 }}
      >
        {/* Grid background effect */}
        <div className="absolute inset-0 opacity-30" 
             style={{ 
               backgroundImage: 'linear-gradient(#FF00FF 1px, transparent 1px), linear-gradient(90deg, #FF00FF 1px, transparent 1px)', 
               backgroundSize: '20px 20px' 
             }} 
        />
        
        {/* Food */}
        <div 
          className="absolute bg-[#FF00FF] animate-pulse"
          style={{
            width: 20,
            height: 20,
            left: food.x * 20,
            top: food.y * 20,
          }}
        />
        
        {/* Snake */}
        {snake.map((segment, i) => (
          <div 
            key={i}
            className={`absolute ${i === 0 ? 'bg-[#00FFFF] z-10 border border-black' : 'bg-[#00FFFF]/80 border border-black'}`}
            style={{
              width: 20,
              height: 20,
              left: segment.x * 20,
              top: segment.y * 20,
            }}
          />
        ))}
        
        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 border-4 border-[#FF00FF]">
            <h2 className="text-2xl md:text-3xl font-pixel text-[#FF00FF] mb-4 glitch text-center" data-text="SYSTEM_FAILURE">SYSTEM_FAILURE</h2>
            <p className="text-[#00FFFF] font-terminal text-2xl mb-8">&gt; FINAL_SCORE: {score}</p>
            <button 
              onClick={resetGame}
              className="px-6 py-3 border-2 border-[#00FFFF] text-[#00FFFF] font-pixel text-sm uppercase hover:bg-[#00FFFF] hover:text-black transition-none"
            >
              [REBOOT]
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-[#FF00FF] font-terminal text-xl text-center space-y-1">
        <p>&gt; INPUT: <span className="text-[#00FFFF]">WASD</span> // <span className="text-[#00FFFF]">ARROWS</span></p>
        <p>&gt; INTERRUPT: <span className="text-[#00FFFF]">SPACE</span></p>
      </div>
    </div>
  );
}
