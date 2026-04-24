import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Point } from '../types';
import { GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from '../constants';
import { Trophy, RotateCcw, Play as PlayIcon, Pause as PauseIcon, Gamepad2 } from 'lucide-react';

const generateFood = (currentSnake: Point[]): Point => {
  let newFood: Point = { x: 0, y: 0 };
  let isOccupied = true;
  while (isOccupied) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    // eslint-disable-next-line no-loop-func
    isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
  }
  return newFood;
};

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [foodState, setFoodState] = useState<Point>({ x: 15, y: 15 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const directionRef = useRef<Point>({ x: 0, y: -1 });
  const lastMoveDirectionRef = useRef<Point>({ x: 0, y: -1 });
  const foodRef = useRef<Point>({ x: 15, y: 15 });

  // Handle Keyboard Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for game controls
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (gameOver) return;

      if (e.key === ' ' && hasStarted) {
        setIsPaused(p => !p);
        return;
      }

      if (!hasStarted && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        setHasStarted(true);
      }

      const { x: lastX, y: lastY } = lastMoveDirectionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (lastY !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
          if (lastY !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
          if (lastX !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
          if (lastX !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, hasStarted]);

  // Game Loop
  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const dir = directionRef.current;
        const newHead = { x: head.x + dir.x, y: head.y + dir.y };

        lastMoveDirectionRef.current = dir;

        // Check Wall Collision
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check Self Collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check Food Collision
        if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
          setScore(s => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setSpeed(s => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
          
          const nextFood = generateFood(newSnake);
          foodRef.current = nextFood;
          setFoodState(nextFood); // Trigger re-render for food UI
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [gameOver, isPaused, hasStarted, speed, highScore]);

  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    directionRef.current = { x: 0, y: -1 };
    lastMoveDirectionRef.current = { x: 0, y: -1 };
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setHasStarted(false);
    setSpeed(INITIAL_SPEED);
    
    const initialFood = { x: 15, y: 15 };
    foodRef.current = initialFood;
    setFoodState(initialFood);
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-[500px]">
      {/* Score Board */}
      <div className="w-full flex justify-between items-center mb-4 px-4 py-3 bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.1)]">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Score</span>
          <span className="text-2xl font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => hasStarted && !gameOver && setIsPaused(!isPaused)}
            className={`p-2 rounded-lg transition-colors ${!hasStarted || gameOver ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:text-fuchsia-400 hover:bg-slate-800'}`}
            disabled={!hasStarted || gameOver}
            aria-label={isPaused ? "Resume game" : "Pause game"}
          >
            {isPaused ? <PlayIcon size={20} /> : <PauseIcon size={20} />}
          </button>
          <button 
            onClick={resetGame}
            className="p-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Reset game"
          >
            <RotateCcw size={20} />
          </button>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-bold flex items-center gap-1">
            <Trophy size={12} className="text-fuchsia-500" /> Best
          </span>
          <span className="text-2xl font-black text-fuchsia-500 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Game Board Container */}
      <div className="relative w-full aspect-square bg-slate-950 rounded-xl p-1 border-2 border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden group">
        
        {/* Neon Border Glow */}
        <div className={`absolute inset-0 border-2 rounded-xl pointer-events-none transition-colors duration-300 ${gameOver ? 'border-red-500/50 shadow-[inset_0_0_20px_rgba(239,68,68,0.3)]' : 'border-cyan-500/30 shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] group-hover:border-cyan-400/50'}`}></div>

        {/* The Grid */}
        <div 
          className="w-full h-full grid gap-[1px] bg-slate-900/50 relative z-10"
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.some((s, idx) => idx !== 0 && s.x === x && s.y === y);
            const isFood = foodState.x === x && foodState.y === y;

            return (
              <div
                key={i}
                className={`w-full h-full rounded-[2px] transition-all duration-75 ${
                  isSnakeHead
                    ? 'bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,1)] z-20 scale-110'
                    : isSnakeBody
                    ? 'bg-cyan-500/90 shadow-[0_0_6px_rgba(6,182,212,0.6)]'
                    : isFood
                    ? 'bg-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,1)] animate-pulse scale-75 rounded-full z-10'
                    : 'bg-slate-800/20'
                }`}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {!hasStarted && !gameOver && (
          <div className="absolute inset-0 z-30 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl">
            <Gamepad2 size={48} className="text-cyan-400 mb-4 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-bounce" />
            <h2 className="text-2xl font-bold text-white tracking-widest mb-2">READY?</h2>
            <p className="text-slate-400 text-sm">Press any arrow key to start</p>
          </div>
        )}

        {isPaused && !gameOver && hasStarted && (
          <div className="absolute inset-0 z-30 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl">
            <h2 className="text-3xl font-black text-cyan-400 tracking-widest drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">PAUSED</h2>
            <p className="text-slate-400 mt-2">Press SPACE to resume</p>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center rounded-xl border border-red-500/30">
            <h2 className="text-4xl font-black text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] mb-2 tracking-widest">SYSTEM FAILURE</h2>
            <p className="text-xl text-slate-300 mb-8 font-bold">Final Score: <span className="text-cyan-400">{score}</span></p>
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-8 py-3 bg-slate-900 border-2 border-cyan-500 text-cyan-400 font-bold rounded-lg hover:bg-cyan-950 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <RotateCcw size={20} />
              REBOOT
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs text-slate-500 flex gap-4">
        <span>Use Arrow Keys or WASD to move</span>
        <span>Space to pause</span>
      </div>
    </div>
  );
};
