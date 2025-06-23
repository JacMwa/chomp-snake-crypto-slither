import { useState, useEffect, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Position {
  x: number;
  y: number;
}

interface GameBoardProps {
  onGameEnd: (score: number) => void;
}

const BOARD_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 150;

const GameBoard = ({ onGameEnd }: GameBoardProps) => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize Audio Context
  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };
    
    // Initialize on first user interaction
    const handleFirstInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  // Play sound effect
  const playSoundEffect = useCallback(() => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Matrix-style digital sound
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  }, []);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    };
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      head.x += direction.x;
      head.y += direction.y;

      // Check wall collision
      if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
        setGameOver(true);
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prevScore => prevScore + 10);
        setFood(generateFood());
        playSoundEffect(); // Play sound when eating food
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood, playSoundEffect]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(!isPaused);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameOver, isPaused]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood({ x: 15, y: 15 });
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  return (
    <div className="max-w-4xl mx-auto font-mono">
      {/* Game Header */}
      <div className="flex justify-between items-center mb-6">
        <Card className="bg-black/80 border-green-500/50 p-4 backdrop-blur-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 font-mono">{score}</div>
            <div className="text-sm text-green-300">DATA CONSUMED</div>
          </div>
        </Card>
        
        <div className="space-x-4">
          <Button 
            onClick={() => setIsPaused(!isPaused)}
            variant="outline"
            className="border-green-500 text-green-400 hover:bg-green-500/20 bg-black/50 font-mono rounded-none"
          >
            {isPaused ? '▶️ RESUME' : '⏸️ PAUSE'}
          </Button>
          <Button 
            onClick={() => onGameEnd(score)}
            variant="outline"
            className="border-red-500 text-red-400 hover:bg-red-500/20 bg-black/50 font-mono rounded-none"
          >
            🏠 EXIT
          </Button>
        </div>
      </div>

      {/* Game Board */}
      <Card className="bg-black/90 backdrop-blur-lg border-green-500/50 p-4">
        <div 
          className="grid gap-0 mx-auto border border-green-500/30"
          style={{ 
            gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
            maxWidth: '600px',
            aspectRatio: '1'
          }}
        >
          {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => {
            const x = index % BOARD_SIZE;
            const y = Math.floor(index / BOARD_SIZE);
            
            const isSnakeHead = snake[0] && snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;
            
            return (
              <div
                key={index}
                className={`
                  aspect-square transition-all duration-100 border border-green-900/30
                  ${isSnakeHead ? 'bg-green-400 shadow-lg shadow-green-400/50 animate-pulse' : ''}
                  ${isSnakeBody ? 'bg-green-500' : ''}
                  ${isFood ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50 animate-pulse' : ''}
                  ${!isSnakeHead && !isSnakeBody && !isFood ? 'bg-black/60' : ''}
                `}
              >
                {isFood && <div className="w-full h-full flex items-center justify-center text-xs text-black font-bold">$</div>}
                {isSnakeHead && <div className="w-full h-full flex items-center justify-center text-xs text-black font-bold">🐍</div>}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Game Controls */}
      <div className="mt-6 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto mb-4">
          <Button 
            onClick={() => direction.y !== 1 && setDirection({ x: 0, y: -1 })}
            variant="outline"
            className="border-green-500 text-green-400 hover:bg-green-500/20 bg-black/50 font-mono rounded-none"
          >
            ⬆️
          </Button>
          <Button 
            onClick={() => direction.x !== 1 && setDirection({ x: -1, y: 0 })}
            variant="outline"
            className="border-green-500 text-green-400 hover:bg-green-500/20 bg-black/50 font-mono rounded-none"
          >
            ⬅️
          </Button>
          <Button 
            onClick={() => direction.y !== -1 && setDirection({ x: 0, y: 1 })}
            variant="outline"
            className="border-green-500 text-green-400 hover:bg-green-500/20 bg-black/50 font-mono rounded-none"
          >
            ⬇️
          </Button>
          <Button 
            onClick={() => direction.x !== -1 && setDirection({ x: 1, y: 0 })}
            variant="outline"
            className="border-green-500 text-green-400 hover:bg-green-500/20 bg-black/50 font-mono rounded-none"
          >
            ➡️
          </Button>
        </div>
        
        <p className="text-green-500 text-sm font-mono">
          Use arrow keys or buttons to navigate • Spacebar to pause system
        </p>
        
        {isPaused && (
          <div className="mt-4 p-4 bg-green-500/20 border border-green-400/50 rounded-none">
            <p className="text-green-300 font-bold font-mono">SYSTEM PAUSED</p>
          </div>
        )}
      </div>

      {/* Game Over Modal */}
      {gameOver && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="bg-black/95 border-red-500/50 p-8 max-w-md mx-4 rounded-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4 text-red-400 font-mono">SYSTEM ERROR! 💀</h2>
              <p className="text-xl mb-2 font-mono">Final Score: <span className="text-green-400 font-bold">{score}</span></p>
              <p className="text-lg mb-6 font-mono">$CHOMP Earned: <span className="text-yellow-400 font-bold">{Math.floor(score / 10)}</span></p>
              
              <div className="space-y-4">
                <Button 
                  onClick={resetGame}
                  className="w-full bg-green-500/20 border-2 border-green-500 text-green-400 hover:bg-green-500/30 font-bold font-mono rounded-none"
                >
                  🔄 RESTART MATRIX
                </Button>
                <Button 
                  onClick={() => onGameEnd(score)}
                  variant="outline"
                  className="w-full border-gray-500 text-gray-400 hover:bg-gray-500/20 bg-black/50 font-mono rounded-none"
                >
                  🏠 EXIT TO MAIN
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
